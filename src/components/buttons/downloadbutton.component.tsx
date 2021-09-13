import React, { ReactNode, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import AutorenewRoundedIcon from '@material-ui/icons/AutorenewRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

const useStyles = makeStyles<Theme, DownloadButtonProps>((theme) => ({
  button: (props) => ({}),
  icon: (props) => ({}),
  downloadingIcon: (props) => ({
    animation: `spin 4s linear infinite`,
  }),
  '@global': {
    '@keyframes spin': {
      '0%': {
        opacity: 0.5,
        transform: 'rotate(0deg)',
      },
      '50%': {
        opacity: 1,
        transform: 'rotate(180deg)',
      },
      '100%': {
        opacity: 0.5,
        transform: 'rotate(360deg)',
      },
    },
  },
}));

export interface DownloadButtonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  progress: number;
  downloadResumeTimeout?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onComplete?: () => void;
  onDownloadResume?: () => void;
}

export type DownloadButtonState = 'button' | 'downloading' | 'complete';

function DownloadButton(props: DownloadButtonProps) {
  const classes = useStyles(props);
  const [downloadState, setDownloadState] = useState<DownloadButtonState>('button');
  const { progress, downloadResumeTimeout } = props;

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (downloadState === 'button') {
      setDownloadState('downloading');

      props.onClick?.(event);
    }
  }

  useEffect(() => {
    if (progress && progress > 0 && progress < 100 && downloadState !== 'downloading') {
      setDownloadState('downloading');
    }

    if (progress && progress >= 100 && downloadState === 'downloading') {
      setDownloadState('complete');
      props.onComplete?.();

      setTimeout(() => {
        setDownloadState('button');
        props.onDownloadResume?.();
      }, downloadResumeTimeout);
    }
  }, [progress, downloadState, downloadResumeTimeout, props])

  let icon;
  switch (downloadState) {
    case 'button':
      icon = <GetAppRoundedIcon className={classes.icon} />
      break;
    case 'downloading':
      icon = <AutorenewRoundedIcon className={classes.icon + ' ' + classes.downloadingIcon} />
      break;
    case 'complete':
      icon = <DoneRoundedIcon className={classes.icon} />
      break;
  }

  return (
    <Button className={classes.button + (props.className ? ' ' + props.className : '')} style={props.style} variant='outlined' color='primary' onClick={handleButtonClick}>
      {icon}
    </Button>
  )
}

DownloadButton.defaultProps = {
  progress: 0,
  downloadResumeTimeout: 3000,
}

export default DownloadButton;
