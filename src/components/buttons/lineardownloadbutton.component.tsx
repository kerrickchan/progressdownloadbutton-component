import React, { ReactNode, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';

const useStyles = makeStyles<Theme, LinearDownloadButtonProps>((theme) => ({
  download: (props) => ({
  }),
  progress: (props) => ({
    width: '100%',
  }),
  complete: (props) => ({
  }),
}));

export interface LinearDownloadButtonProps {
  children?: ReactNode;
  progress?: number;
  downloadResumeTimeout?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onComplete?: () => void;
  onDownloadResume?: () => void;
}

export type LinearDownloadButtonState = 'button' | 'downloading' | 'complete';

function LinearDownloadButton(props: LinearDownloadButtonProps) {
  const classes = useStyles(props);
  const [downloadState, setDownloadState] = useState<LinearDownloadButtonState>('button');
  const { children, progress, downloadResumeTimeout } = props;

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadState('downloading');

    props.onClick?.(event);
  }

  useEffect(() => {
    if (progress && progress >= 100 && downloadState === 'downloading') {
      setDownloadState('complete');
      props.onComplete?.();
  
      setTimeout(() => {
        setDownloadState('button');
        props.onDownloadResume?.();
      }, downloadResumeTimeout);
    }
  }, [progress, downloadState, downloadResumeTimeout, props])

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

LinearDownloadButton.defaultProps = {
  progress: 0,
  downloadResumeTimeout: 3000,
}

export default LinearDownloadButton;
