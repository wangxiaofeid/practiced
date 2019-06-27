import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import DataSet from '@antv/data-set';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
    Label,
    Legend,
    View,
    Shape,
    Facet,
    G2,
} from 'bizcharts';

@inject('analyseStore')
@observer
export default class BarLineChart extends Component {
    constructor(props) {
        super(props);
        this.chartIns = null;
    }
    onPlotLeave = () => {
        this.chart.chart.hideTooltip();
    };
    render() {
        const { storeValueKey, type, analyseStore, unit = '百万', store } = this.props;
        const data = (store || analyseStore)[storeValueKey].toJS();
        const scale = {
            call: {
                min: 0,
            },
            qps: {
                min: 0,
                alias: `请求量（${unit}）`,
            },
            normalRatio: {
                // min: 90,
                alias: '正常请求率',
            },
        };
        return (
            <div id={storeValueKey} onMouseLeave={this.onPlotLeave}>
                <Chart
                    ref={c => (this.chart = c)}
                    height={330}
                    scale={scale}
                    forceFit
                    data={data}
                    padding={[35, 60, 80, 65]}
                    onGetG2Instance={chart => {
                        this.chartIns = chart;
                    }}
                    onPlotClick={this.onPlotClick}
                >
                    <Legend
                        custom={true}
                        allowAllCanceled={true}
                        items={[
                            {
                                value: '请求量',
                                marker: { symbol: 'square', fill: '#3182bd', radius: 5 },
                            },
                            {
                                value: '正常请求率',
                                marker: {
                                    symbol: 'hyphen',
                                    stroke: '#ffae6b',
                                    radius: 5,
                                    lineWidth: 3,
                                },
                                itemFormatter: val => val,
                            },
                        ]}
                        onClick={ev => {
                            const item = ev.item;
                            const value = item.value;
                            const checked = ev.checked;
                            const geoms = this.chartIns.getAllGeoms();
                            for (let i = 0; i < geoms.length; i++) {
                                const geom = geoms[i];
                                if (geom.getYScale().field === value) {
                                    if (checked) {
                                        geom.show();
                                    } else {
                                        geom.hide();
                                    }
                                }
                            }
                        }}
                    />
                    <Axis
                        name="normalRatio"
                        grid={null}
                        label={{
                            formatter: val => val,
                        }}
                    />
                    <Axis name="qps" title />
                    <Tooltip inPlot={false} />
                    <Geom type="interval" position={`${type}*qps`} color="#3182bd">
                        <Label content="qps" />
                    </Geom>
                    <Geom
                        type="line"
                        position={`${type}*normalRatio`}
                        color="#fdae6b"
                        size={3}
                        shape="smooth"
                    />
                    <Geom
                        type="point"
                        position={`${type}*normalRatio`}
                        color="#fdae6b"
                        size={3}
                        shape="circle"
                    >
                        <Label
                            content={[`${type}*normalRatio`, (month, normalRatio) => normalRatio]}
                        />
                    </Geom>
                </Chart>
            </div>
        );
    }
}
