import mermaid from 'mermaid';
import React, { useEffect } from 'react';
import './App.css';

import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    } 
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    } 
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
  fontFamily: "Fira Code"
});

const Mermaid = ({ chart }) => {

  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return (
    <div style={{height: '100%', width: '100%'}}>
      <TransformWrapper
      initialScale={2}
      maxScale={16}
      minScale={0.5}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <>
          <TransformComponent 
            wrapperStyle={{ width: "100%", height: "100%" }}>
            <div className="mermaid">{chart}</div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  </div>
  );
};

export default Mermaid;
