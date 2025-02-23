import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CollectOpenActionModuleType } from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import type { CollectModuleType } from '@hey/types/hey';
import { Button, ErrorMessage, Spinner } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { type Dispatch, type FC, type SetStateAction } from 'react';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';
import { isAddress } from 'viem';

import AmountConfig from './AmountConfig';
import CollectLimitConfig from './CollectLimitConfig';
import FollowersConfig from './FollowersConfig';
import ReferralConfig from './ReferralConfig';
import SplitConfig from './SplitConfig';
import TimeLimitConfig from './TimeLimitConfig';

interface CollectFormProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const CollectForm: FC<CollectFormProps> = ({ setShowModal }) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);
  const reset = useCollectModuleStore((state) => state.reset);
  const setCollectModule = useCollectModuleStore(
    (state) => state.setCollectModule
  );

  const { SimpleCollectOpenActionModule } = CollectOpenActionModuleType;
  const recipients = collectModule.recipients ?? [];
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.split, 0);
  const hasEmptyRecipients = recipients.some(
    (recipient) => !recipient.recipient
  );
  const hasInvalidEthAddressInRecipients = recipients.some(
    (recipient) => recipient.recipient && !isAddress(recipient.recipient)
  );
  const isRecipientsDuplicated = () => {
    const recipientsSet = new Set(
      recipients.map((recipient) => recipient.recipient)
    );
    return recipientsSet.size !== recipients.length;
  };

  const setCollectType = (data: CollectModuleType) => {
    setCollectModule({
      ...collectModule,
      ...data
    });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['getAllTokens'],
    queryFn: () => getAllTokens()
  });

  if (isLoading) {
    return (
      <div className="space-y-2 px-5 py-3.5 text-center font-bold">
        <Spinner size="md" className="mx-auto" />
        <div>Loading collect settings</div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load modules"
        error={error}
        className="m-5"
      />
    );
  }

  const toggleCollect = () => {
    if (!collectModule.type) {
      setCollectType({ type: SimpleCollectOpenActionModule });
    } else {
      reset();
    }
  };

  return (
    <div className="space-y-3 p-5">
      <ToggleWithHelper
        on={collectModule.type !== null}
        setOn={toggleCollect}
        description="This post can be collected"
      />
      {collectModule.type !== null ? (
        <div className="ml-5">
          <AmountConfig allowedTokens={data} setCollectType={setCollectType} />
          {collectModule.amount?.value ? (
            <>
              <ReferralConfig setCollectType={setCollectType} />
              <SplitConfig
                isRecipientsDuplicated={isRecipientsDuplicated}
                setCollectType={setCollectType}
              />
            </>
          ) : null}
          <CollectLimitConfig setCollectType={setCollectType} />
          <TimeLimitConfig setCollectType={setCollectType} />
          <FollowersConfig setCollectType={setCollectType} />
        </div>
      ) : null}
      <div className="flex space-x-2 pt-5">
        <Button
          className="ml-auto"
          variant="danger"
          outline
          onClick={() => {
            setShowModal(false);
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={
            (parseFloat(collectModule.amount?.value as string) <= 0 &&
              collectModule.type !== null) ||
            splitTotal > 100 ||
            hasEmptyRecipients ||
            hasInvalidEthAddressInRecipients ||
            isRecipientsDuplicated()
          }
          onClick={() => setShowModal(false)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CollectForm;
