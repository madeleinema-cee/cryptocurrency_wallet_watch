import {Chart, ChartAxis} from "@patternfly/react-charts";
import React, {Component} from "react";

function Button(props) {
  return (
      <div>
    <ChartAxis crossAxis
                                               style={{
                                                   axis: {
                                                       stroke: '#d1d9e0'
                                                   },
                                                   tickLabels: {
                                                       fill: '#d1d9e0',
                                                       fontFamily: 'Istok Web',
                                                   },
                                                   grid: {
                                                       stroke: ({tick}) => tick > 1 ? "#adb5bd" : "#adb5bd",
                                                       opacity: 0.1
                                                   }

                                               }}
                                               padding={{bottom: 20}}
                                    />
                                    <ChartAxis dependentAxis crossAxis
                                               tickFormat={(t) => `$${(t)}`}
                                               style={{
                                                   axis: {
                                                       stroke: '#d1d9e0',
                                                   },
                                                   tickLabels: {
                                                       fill: '#d1d9e0',
                                                       fontFamily: 'Istok Web'
                                                   },
                                                   grid: {
                                                       stroke: ({tick}) => tick > 5000 ? "#adb5bd" : "#adb5bd",
                                                       opacity: 0.1
                                                   }
                                               }}/>
      </div>
  );
}
export default Button;