// Copyright 2019-2022 @bagpipes/xcm-send authors & contributors
// SPDX-License-Identifier: Apache-2.0
//@ts-nocheck
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFCP, getFID, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(console.error);
  }
};

export default reportWebVitals;
