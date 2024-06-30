import React from 'react'

export function FormatDate(date : string) {
    const formatDate = (isoDate : string) => {
        const dateObj = new Date(isoDate);
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds} ${ampm}`;
        return `${dateObj.toLocaleDateString()} ${strTime}`;
      };
    
      return (
        <>
          {formatDate(date)}
        </>
      );
}