import { FirstDataSource, SecondDataSource } from "@/interface/filedetails.interface";
import toast from "react-hot-toast";

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

  export const generateUniqueFileName = (originalName: string) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomString}.${extension}`;
  };

  export  const generateRandomId = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters[randomIndex];
    }
    const timestamp = Date.now().toString();
    return `t_id_${randomPart}${timestamp}`;
  };

  export function displaySubtitle(item:any) {
    const notes = item.notes || '';
    const content = item.content || [];
    
    const contentLinks = content.map((link:any) => 
      link ? `<a href="${link}">${link}</a>` : ''
    ).filter(Boolean).join('\n');
    
    return notes + (notes && contentLinks ? '\n' : '') + contentLinks;
  }

  export function extractFilename(path:string) {
    // Split the string by '/' and get the last part
    const parts = path.split('/');
    
    // Return the last part, which should be the filename
    return parts[parts.length - 1];
  }

  // export function extractFilenameFromUrl(url:string) {
  //   // Remove any surrounding quotes if present
  //   url = url.replace(/^["']|["']$/g, '');
    
  //   // Split the URL by '/' and get the last part
  //   const parts = url.split('/');
    
  //   // Get the last part (filename with possible query parameters)
  //   const lastPart = parts[parts.length - 1];
    
  //   // Split by '?' to remove any query parameters and get the filename
  //   const filename = lastPart.split('?')[0];
    
  //   return filename;
  // }

  export function extractFilenameFromUrl(url: string) {
    // Remove any surrounding quotes if present
    url = url.replace(/^["']|["']$/g, '');
    
    try {
      // Create a URL object
      const urlObject = new URL(url);
      
      // Get the pathname
      let pathname = urlObject.pathname;
      
      // Remove '/storage/v1/object/public/' if present
      pathname = pathname.replace('/storage/v1/object/public/', '');
      
      // Split the remaining path by '/'
      const parts = pathname.split('/');
      
      // Get the last part (filename)
      let filename = parts[parts.length - 1];
      
      // Decode the URL-encoded filename
      filename = decodeURIComponent(filename);
      
      return filename;
    } catch (error) {
      console.error('Error parsing URL:', error);
      
      // Fallback to the old method if URL parsing fails
      const parts = url.split('/');
      let filename = parts[parts.length - 1];
      filename = filename.split('?')[0]; // Remove query parameters
      return decodeURIComponent(filename);
    }
  }



// export function combineData(firstSource: FirstDataSource[], secondSource: SecondDataSource[]): (FirstDataSource & SecondDataSource)[] {
//   const combinedData = firstSource.map(firstItem => {
//     const matchingSecondItem = secondSource.find(secondItem => {
//       console.log('secodeeeeeeeeeeeeeee',secondItem.filedetails.studentfileid)
//       if (!secondItem) {
//         console.log('secondItem is undefined or null');
//         return false;
//       }
      
//       if (!secondItem.filedetails) {
//         console.log('secondItem.filedetails is undefined or null');
//         return false;
//       }
      
//       if (!secondItem.filedetails.studentfileid) {
//         console.log('secondItem.filedetails.studentfileid is undefined or null');
//         return false;
//       }
//       secondItem.filedetails.studentfileid === firstItem.id
//     }
//     );

//     console.log('matched item',matchingSecondItem)

//     if (matchingSecondItem) {
//       return { ...firstItem, ...matchingSecondItem };
//     }

//     return firstItem;
//   });

//   return combinedData as (FirstDataSource & SecondDataSource)[] ;
// }

export function combineData(firstSource: FirstDataSource[], secondSource: SecondDataSource[]): (FirstDataSource & SecondDataSource)[] {
  const combinedData = firstSource.map(firstItem => {
    const matchingSecondItem = secondSource.find(secondItem => {
      // Log the entire secondItem for debugging
      // console.log('Current secondItem:', JSON.stringify(secondItem, null, 2));
      
      // Check if secondItem and its properties exist
      if (!secondItem || typeof secondItem !== 'object') {
        // console.log('secondItem is not a valid object');
        return false;
      }
      
      if (!secondItem.filedetails || typeof secondItem.filedetails !== 'object') {
        // console.log('secondItem.filedetails is not a valid object');
        return false;
      }
      
      // Use optional chaining and nullish coalescing for safer property access
      const studentFileId = secondItem.filedetails?.studentfileid ?? null;
      // console.log('studentFileId:', studentFileId);
      // console.log('firstItem.id:', firstItem.id);
      
      if (studentFileId === null) {
        // console.log('studentfileid is null or undefined');
        return false;
      }
      
      // Ensure both values are of the same type before comparison
      return String(studentFileId) === String(firstItem.id);
    });

    // console.log('Matched item:', matchingSecondItem);

    if (matchingSecondItem) {
      return { ...firstItem, ...matchingSecondItem };
    }

    return firstItem;
  });

  return combinedData as (FirstDataSource & SecondDataSource)[];
}
