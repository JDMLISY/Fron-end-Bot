import { ElementRef, QueryList } from '@angular/core';

export const timeFormater = (time: string) => {
  const date = time.split('T')[0];
  if (date) {
    console.log('func/var: ChatWindowComponent -> timeFormater -> date', date);
  }
  const splitTime = time.split('T')[1];
  return splitTime.slice(0, 5);
};

export const scrollToBottom = (messageItems: QueryList<ElementRef>) => {
  const lastMessageItem = messageItems.last;
  if (lastMessageItem) {
    lastMessageItem.nativeElement.scrollIntoView();
  }
};

export const randomColorShortNameGenerator = (arr: any) => {
  const firstTwo = [arr[0], arr[1]];
  const ShortNames = [];
  for (let element of firstTwo) {
    let names = element.userName.split(' ');
    ShortNames.push(names[0].slice(0, 1) + (names[1] && names[1]?.slice(0, 1)));
  }
  return ShortNames;
};

export const generateRandomColor = () => {
  const colors = ['Red', 'Green', 'Blue', 'Purple', 'Orange'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const sumText = (text: string, type: string) => {
  if (type === 'title') return text.slice(0, 25) + '...';
  else if (type === 'desc') return text.slice(0, 35) + '...';
  else return '...';
};
