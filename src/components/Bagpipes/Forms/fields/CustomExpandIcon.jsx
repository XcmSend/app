
import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export const CustomExpandIcon = (panelProps) => (
    <CaretRightOutlined 
      rotate={panelProps.isActive ? 90 : 0}
      style={{ color: 'gray', fontSize: '12px' }}
    />
  );