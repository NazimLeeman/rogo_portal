export const formatDate = (dataString: any) => {
    const date = new Date(dataString);

    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
  };

  export const highestState = (steps:any) => {
    if (!steps || steps.length === 0) {
      return null; // or some default value
    }
  
    // Use reduce to find the highest state
    const highest = steps.reduce((max:any, item:any) => {
      return item.state > max ? item.state : max;
    }, steps[0].state);
  
    return highest;
  }