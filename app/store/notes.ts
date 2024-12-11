import { createPersistStore } from '@/app/utils';
import { Note, Notes, NoteSearchParams } from '@/app/shared';
import RequestService from '@/app/platform/request/browser/RequestService';

const DEFAULT_NOTES = {
  notes: {
    pageNo: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
    data: [] as Note[]
  },
  searchNote: { keyWord: '' },
  isOpen: false,
  openNote: { id: '', title: '' },
  editNoteId: '',
  addNoteTitle: '',
  pending: true,
  selectedPerPage: { id: 1, name: `5/page`, pageSize: 5 },
  perPages: [
    { id: 1, name: `5/page`, pageSize: 5 },
    { id: 2, name: `10/page`, pageSize: 10 },
    { id: 3, name: `15/page`, pageSize: 15 },
    { id: 4, name: `20/page`, pageSize: 20 }
  ]
};

export const useNotesStore = createPersistStore(
  { ...DEFAULT_NOTES },
  (set, _get) => {
    function get() {
      return {
        ..._get(),
        ...methods
      };
    }
    const methods = {
      async fetchNotes(searchParams?: NoteSearchParams) {
        set(() => ({ pending: true }));
        searchParams = Object.assign(
          {
            pageNo: get().notes.pageNo,
            pageSize: get().notes.pageSize,
            keyWord: get().searchNote.keyWord
          },
          searchParams
        );
        const notes = await RequestService.notes.fetchData(searchParams);
        set(() => ({
          selectedPerPage: get().perPages.find((item) => item.pageSize === notes.pageSize)
        }));
        set(() => ({ notes, pending: false }));
      },
      async addNote() {
        set(() => ({ pending: true }));
        const id = await RequestService.notes.addNote(get().addNoteTitle);
        if (!id) return;
        set(() => ({ addNoteTitle: '' }));
        set(() => ({ searchNote: { ...get().searchNote, keyWord: '' } }));
        get().fetchNotes({ pageNo: 1, pageSize: get().notes.pageSize, keyWord: get().searchNote.keyWord });
      },
      async updateNote(note: Note) {
        set(() => ({ pending: true }));
        const data = await RequestService.notes.updateNote(note);
        if (!data) return;
        get().fetchNotes();
      },
      async deleteNote(id?: string) {
        set(() => ({ isOpen: false, pending: true }));
        const data = await RequestService.notes.deleteNote(id || get().openNote.id);
        if (!data) return;
        set(() => ({ openNote: { id: '', title: '' } }));
        get().fetchNotes();
      },
      setNotes(notes: Notes) {
        set(() => ({ notes }));
      },
      setIsOpen(isOpen: boolean) {
        set(() => ({ isOpen }));
      },
      setOpenNote(note: Note) {
        set(() => ({ openNote: note }));
      },
      setEditNoteId(id: string) {
        set(() => ({ editNoteId: id }));
      },
      setAddNoteTitle(title: string) {
        set(() => ({ addNoteTitle: title }));
      },
      setSelectedPerPage(selectedPerPage: typeof DEFAULT_NOTES.selectedPerPage) {
        set(() => ({ selectedPerPage }));
        set(() => ({ notes: { ...get().notes, pageSize: selectedPerPage.pageSize } }));
        get().fetchNotes();
      },
      setSearchNote(searchNote: typeof DEFAULT_NOTES.searchNote) {
        set(() => ({ searchNote: { ...get().searchNote, ...searchNote } }));
      }
    };
    return methods;
  },
  { name: 'notes' }
);
