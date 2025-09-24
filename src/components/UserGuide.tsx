import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';

interface UserGuideProps {
  steps: Step[];
  storageKey?: string;
  onComplete?: () => void;
  onStepChange?: (index: number) => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ 
  steps, 
  onStepChange,
  onComplete ,

}) => {
  const [run, setRun] = useState(false);

  useEffect(() => {
    setRun(true);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, type , index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
        onComplete?.();
 
    } else {
      onStepChange?.(index);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      styles={{
        options: {
          primaryColor: '#2563eb',
          zIndex: 10000,
        },
        spotlight: {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: '10px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      callback={handleJoyrideCallback}
    />
  );
};

export default UserGuide;
