import React, { ReactNode, useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import AutorenewRoundedIcon from '@material-ui/icons/AutorenewRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { isClassExpression } from 'typescript';

const useStyles = makeStyles<Theme, DownloadButtonProps>((theme) => ({
  download: (props) => ({
  }),
  wait: (props) => ({
  }),
  progress: (props) => ({
  }),
  progressIcon: (props) => ({
    animation: 'spin 4s linear infinite',
  }),
  complete: (props) => ({
  }),
}));

export interface DownloadButtonProps {
  children?: ReactNode;
  progress?: number;
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
      component = <Button className={classes.download} variant='outlined' color='primary' onClick={handleButtonClick}><GetAppRoundedIcon /></Button>
      break;
    case 'downloading':
      component = progress && progress > 0 && progress < 100?
        <Button className={classes.progress} style={{}} variant='outlined' color='primary' onClick={handleButtonClick}><AutorenewRoundedIcon className={classes.progressIcon} /></Button> :
        <Button className={classes.wait} variant='outlined' color='primary' onClick={handleButtonClick}><AutorenewRoundedIcon className={classes.progressIcon} /></Button>
      break;
    case 'complete':
      component = <Button className={classes.complete} variant='outlined' color='primary'><DoneRoundedIcon /></Button>
      break;
  }

  return <>
    <style>
      {
        `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }
    </style>
    {component}
  </>
}

DownloadButton.defaultProps = {
  progress: 0,
  downloadResumeTimeout: 3000,
}

export default DownloadButton;
