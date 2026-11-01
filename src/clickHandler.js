import { onBeforeUnmount } from 'vue'

export const useClickHandler = ({ singleClick, doubleClick, longPress }) => {
  const doubleClickDelay = 300;
  const longPressDelay = 500;
  let clickTimeout;
  let longPressTimeout;
  let suppressNextClick = false;

  const handlePointerDown = () => {
    suppressNextClick = false;
    longPressTimeout = window.setTimeout(() => {
      if (clickTimeout) {
        window.clearTimeout(clickTimeout);
        clickTimeout = undefined;
      }
      suppressNextClick = true;
      longPress();
    }, longPressDelay);
  }

  const handlePointerUp = () => {
    window.clearTimeout(longPressTimeout);
  }

  const handlePointerCancel = () => {
    window.clearTimeout(longPressTimeout);
    suppressNextClick = false;
  }

  const handleClick = () => {
    if (suppressNextClick) {
      suppressNextClick = false;
      return;
    }

    if (clickTimeout) {
      window.clearTimeout(clickTimeout);
      clickTimeout = undefined;
      doubleClick();
      return;
    }

    clickTimeout = window.setTimeout(() => {
      clickTimeout = undefined;
      singleClick();
    }, doubleClickDelay);
  }

  onBeforeUnmount(() => {
    window.clearTimeout(clickTimeout);
    window.clearTimeout(longPressTimeout);
  });

  return {
    handlePointerDown,
    handlePointerUp,
    handlePointerCancel,
    handleClick,
  };
}