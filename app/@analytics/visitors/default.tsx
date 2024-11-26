import { FC } from 'react';
import { sleep } from '@/app/utils';

const Default: FC = async () => {
  await sleep(1000 * 5);
  return (
    <div className="h-10 flex-1 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
      Hello, Analytics Visitors Default!
    </div>
  );
};
export default Default;
