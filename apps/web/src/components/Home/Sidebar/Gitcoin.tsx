import CountdownTimer from '@components/Shared/CountdownTimer';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Card } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';

const Gitcoin: FC = () => {
  return (
    <Card
      as="aside"
      className="mb-4 space-y-4 !border-[#27bdce] !bg-[#27bdce]/10 p-5 text-[#1396a5] dark:bg-[#27bdce]/50"
    >
      <img
        src={`${STATIC_IMAGES_URL}/brands/gitcoin.png`}
        alt="Gitcoin emoji"
        className="mx-auto h-14"
      />
      <div className="space-y-3 text-center text-sm">
        <div className="font-bold">
          Support {APP_NAME} on Gitcoin Grants Round 19
        </div>
        <div className="text-lg font-bold tracking-wide">
          <CountdownTimer targetDate={new Date(1701302340 * 1000).toString()} />
        </div>
        <div>
          <Link
            href="https://hey.xyz/gitcoin"
            className="font-bold underline"
            target="_blank"
            onClick={() => Leafwatch.track(MISCELLANEOUS.OPEN_GITCOIN)}
          >
            Contribute now
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default Gitcoin;
