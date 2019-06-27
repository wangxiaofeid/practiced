import React, { Component } from 'react';
import * as BizCharts from 'bizcharts';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import DataSet from '@antv/data-set';
const { Chart, Axis, Geom, Tooltip, Legend } = BizCharts;
const color = ['#2fc25b', '#fbd240', '#9554e3', '#6ccb74', '#65cbcb', '#5448ce', '#ea5579'];

@inject('analyseStore')
@observer
class BarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLegend: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { analyseStore, storeValueKey, valueKey, store } = nextProps;
        const newData = (store || analyseStore)[storeValueKey].toJS();
        // console.log(newData.length, `${storeValueKey}1`);
        if (newData.length == 0) {
            return {
                // showLegend: _.uniq(newData.map(i => i[valueKey]))
                showLegend: [],
            };
        }
        return null;
    }

    componentDidUpdate() {
        const { analyseStore, storeValueKey, valueKey, store } = this.props;
        const data = (store || analyseStore)[storeValueKey].toJS();
        if (this.state.showLegend.length == 0 && data.length > 0) {
            this.setState({
                showLegend: _.uniq(data.map(i => i[valueKey])),
            });
        }
    }

    // UNSAFE_componentWillReceiveProps(nextProps) {
    //   const { analyseStore, storeValueKey, valueKey } = nextProps;
    //   const newData = analyseStore[storeValueKey].toJS(), oldData = this.props.analyseStore[storeValueKey].toJS();
    //   console.log(newData.length, oldData.length, `${storeValueKey}1`);
    //   if (newData.length != oldData.length) {
    //     this.setState({
    //       showLegend: _.uniq(newData.map(i => i[valueKey]))
    //     });
    //   }
    // }

    onTooltipChange = ev => {
        let items = ev.items || [];
        const list = _.sortBy(items, [
            function(o) {
                return -parseInt(o.value);
            },
        ]);
        items.length = 0;
        items.push.apply(items, list);
    };

    onClick = ev => {
        const { onClick, clickArgs } = this.props;
        const { data } = ev;
        if (data && onClick) {
            onClick(data, clickArgs);
        }
    };

    onPlotLeave = () => {
        this.chart.chart.hideTooltip();
    };

    render() {
        const {
            analyseStore,
            storeValueKey,
            valueKey,
            unit = '个',
            originDataKeys,
            store,
        } = this.props;
        const { showLegend } = this.state;
        const data = (store || analyseStore)[storeValueKey].toJS();
        // console.log(data, `${storeValueKey}2`, showLegend);
        const reasonCodeMap = _.groupBy(data, valueKey);
        const _data = [];
        Object.keys(reasonCodeMap).forEach(reasonCode => {
            const d = {};
            const originData = {};
            _.sortBy(reasonCodeMap[reasonCode], 'ds').forEach(item => {
                d[valueKey] = reasonCode;
                d[item.ds] = item.qps;
                originData[item.ds] = {};
                (originDataKeys || []).forEach(key => {
                    originData[item.ds][key] = item[key];
                });
            });
            d.originData = originData;
            _data.push(d);
        });
        const fields = _.uniq(_.sortBy(data, 'ds').map(v => v.ds));
        const legendItems = _data.map((item, i) => {
            return {
                value: item[valueKey],
                marker: {
                    symbol: 'square',
                    fill: showLegend.includes(item[valueKey]) ? color[i % 7] : '#c8c8c8',
                },
            };
        });
        const itemColor = _.filter(legendItems, i => i.marker.fill != '#c8c8c8').map(
            i => i.marker.fill
        );
        const allLegend = _data.map(i => i[valueKey]);

        const ds = new DataSet();
        const dv = ds.createView().source(_.filter(_data, i => showLegend.includes(i[valueKey])));
        dv.transform({
            type: 'fold',
            fields,
            key: 'ds', // key字段
            value: 'qps', // value字段
        });
        const scale = {
            qps: {
                min: 0,
                alias: `请求量（${unit}）`,
            },
        };

        return (
            <div id={storeValueKey} onMouseLeave={this.onPlotLeave}>
                <Chart
                    ref={c => (this.chart = c)}
                    onGetG2Instance={chart => {
                        this.chartIns = chart;
                    }}
                    onPlotClick={this.onClick}
                    height={330}
                    padding="auto"
                    scale={scale}
                    data={dv}
                    forceFit
                    onTooltipChange={this.onTooltipChange}
                >
                    <Legend
                        custom={true}
                        items={legendItems}
                        // offsetX={20}
                        onClick={ev => {
                            const item = ev.item;
                            const value = item.value;
                            const checked = ev.checked;
                            const shiftKey = ev.event.event.shiftKey || ev.event.event.metaKey;
                            if (shiftKey) {
                                this.setState({
                                    showLegend: showLegend.includes(value)
                                        ? _.filter(showLegend, i => i != value)
                                        : [...showLegend, value],
                                });
                            } else {
                                this.setState({
                                    showLegend:
                                        checked ||
                                        (!checked && showLegend.length > 1) ||
                                        (showLegend.length == 1 && showLegend[0] != value)
                                            ? [value]
                                            : allLegend,
                                });
                            }
                        }}
                    />
                    <Axis name="ds" />
                    <Axis name="qps" title />
                    <Tooltip inPlot={false} />
                    <Geom
                        type="intervalStack"
                        position="ds*qps"
                        color={[valueKey, itemColor]}
                        style={{ stroke: '#fff', lineWidth: 1 }}
                    />
                </Chart>
            </div>
        );
    }
}

export default BarChart;
