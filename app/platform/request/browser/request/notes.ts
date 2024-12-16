import { isDynamic, Note, Notes, notes, NoteSearchParams } from '@/app/shared';
import { toast } from 'sonner';

export let notesAbortController = new AbortController();
const signal = AbortSignal.any([notesAbortController.signal]);

export const fetchData = async (searchParams: NoteSearchParams): Promise<Notes> => {
  notesAbortController = new AbortController();
  if (!isDynamic) {
    return notes;
  }
  try {
    const startDate = searchParams?.startDate ?? '';
    const endDate = searchParams?.endDate ?? '';
    const res = await fetch(
      `/api/notes?pageNo=${searchParams.pageNo}&pageSize=${searchParams.pageSize}&keyWord=${searchParams.keyWord}&startDate=${startDate}&endDate=${endDate}`,
      { signal }
    );
    if (!res.ok) {
      const message = (await res.json())?.message ?? 'Unknown error';
      throw new Error(`Status: ${res.status} Reason: ${message}`);
    }
    const data = await res.json();
    return data;
  } catch (e) {
    toast.error(`${e}`);
    return { totalCount: 0, totalPages: 0, data: [], pageNo: searchParams.pageNo, pageSize: searchParams.pageSize };
  }
};

export const addNote = async (note: Partial<Note>) => {
  notesAbortController = new AbortController();
  const res = await fetch(`/api/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
    signal
  });
  if (!res.ok) {
    const message = (await res.json())?.message ?? 'Unknown error';
    throw new Error(`Status: ${res.status} Reason: ${message}`);
  }
  const data = await res.json();
  const newId = data?.[0]?.id; // 获取新增记录的 id
  return newId;
};

export const updateNote = async (note: Note) => {
  notesAbortController = new AbortController();
  const res = await fetch(`/api/notes`, { method: 'PUT', body: JSON.stringify(note), signal });
  if (!res.ok) {
    const message = (await res.json())?.message ?? 'Unknown error';
    throw new Error(`Status: ${res.status} Reason: ${message}`);
  }
  const data = await res.json();
  const newData = data?.[0];
  return newData;
};

export const deleteNote = async (id: number) => {
  notesAbortController = new AbortController();
  const res = await fetch(`/api/notes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id }),
    signal
  });

  if (!res.ok) {
    const message = (await res.json())?.message ?? 'Unknown error';
    throw new Error(`Status: ${res.status} Reason: ${message}`);
  }
  const data = await res.json();
  const effectRows = data?.length;
  return effectRows;
};
