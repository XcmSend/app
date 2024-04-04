//import * as zlib from 'zlib';
//var URLSafeBase64 = require('urlsafe-base64');
import * as pako from 'pako';

import { saveUrl, getUrl } from './handledb';


export async function compressString(input: string): Promise<string> {
  console.log(`compressing string`)
  try {
    const utf8encoded = new TextEncoder().encode(input);
    const compressed = pako.deflate(utf8encoded);
    const base64encoded = btoa(String.fromCharCode.apply(null, compressed));

    console.log('Base64 Encoded:', base64encoded);

    
    const shortUrl = await saveUrl(base64encoded);
    console.log('saved link: ', shortUrl);

    return shortUrl.shortUrl;
  } catch (error) {
    console.error('Error compressing string:', error);
    return ''; // Return an empty string or handle the error as needed
  }
}

function addPadding(base64String: string): string {
  while (base64String.length % 4 !== 0) {
    base64String += '=';
  }
  return base64String;
}

  export async function decompressString(compressedInput: string): Promise<string> {
   //  console.log(`decompressing string`);
   //  console.log(`got input:`, compressedInput);
    try {
      const expandedUrl = await getUrl(compressedInput);
     //  console.log(`expanded url:`, expandedUrl);
      // console.log(`0 expanded url:`, expandedUrl.longUrl);
   
      const newinput = expandedUrl;
     // console.log(`newinput:`, newinput);
      const in2 = addPadding(newinput);
      // Ensure that the base64 string is properly formatted
      const formattedInput = in2.replace(/[^A-Za-z0-9+/]/g, '');

      console.log('Formatted Input:', formattedInput);

      const uint8Array = new Uint8Array(
        atob(formattedInput)
          .split('')
          .map((char) => char.charCodeAt(0))
      );

      const decompressed = pako.inflate(uint8Array, { to: 'string' });
     //  console.log(`calling get url`);

      return decompressed;
    } catch (error) {
      console.error('Error decoding base64 string:', error);
      return ''; // Return an empty string or handle the error as needed
    }
  }
