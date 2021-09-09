import React, { ReactNode, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

const useStyles = makeStyles<Theme, DownloadButtonProps>((theme) => ({
  download: (props) => ({
  }),
  progress: (props) => ({
    width: '100%',
  }),
  complete: (props) => ({
  }),
}));

export interface DownloadButtonProps {
  children?: ReactNode;
  progress?: number;
  redownloadTimeout: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onComplete?: () => void;
}

export type DownloadButtonState = 'button' | 'downloading' | 'complete';

function DownloadButton(props: DownloadButtonProps) {
  const classes = useStyles(props);
  const [downloadState, setDownloadState] = useState<DownloadButtonState>('button');

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadState('downloading');

    props.onClick?.(event);
  }

  const { children, progress, redownloadTimeout } = props;

  useEffect(() => {
    if (progress && progress >= 100 && downloadState === 'downloading') {
      setDownloadState('complete');
  
      setTimeout(() => {
        setDownloadState('button');
      }, redownloadTimeout);

      props.onComplete?.();
    }
  }, [progress, redownloadTimeout, downloadState])

  let component;
  switch (downloadState) {
    case 'button':
      component = <Button className={classes.download} variant='outlined' color='primary' onClick={handleButtonClick}><GetAppRoundedIcon />{children}</Button>
      break;
    case 'downloading':
      component = progress && progress > 0 && progress < 100?
        <LinearProgress className={classes.progress} color='primary' variant='determinate' value={progress} /> :
        <LinearProgress className={classes.progress} color='primary' />
      break;
    case 'complete':
      component = <Button className={classes.complete} variant='outlined' color='primary'><DoneRoundedIcon />{children}</Button>
      break;
  }

  return component;
}

DownloadButton.defaultProps = {
  progress: 0,
  redownloadTimeout: 3000,
}

export default DownloadButton;
