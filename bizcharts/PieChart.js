import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table } from 'td-ui';
import numeral from 'numeral';
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
export default class PieChart extends Component {
    onPlotLeave = () => {
        this.chart.chart.hideTooltip();
    };
    render() {
        const { valueKey, nameKey, storeValueKey, analyseStore, title, showMore, top } = this.props;

        const data = analyseStore[storeValueKey].toJS();
        const allNum = data.length > 0 ? data.map(i => i[valueKey]).reduce((i, j) => i + j) : 1;
        data.map(i => (i.scale = numeral((i[valueKey] * 100) / allNum).format('0.00') + '%'));

        if (showMore) {
            const tableData = _.sortBy(
                [...data],
                [
                    function(o) {
                        return -o[valueKey];
                    },
                ]
            );
            console.log(data, tableData);
            const columns = [
                {
                    title: nameKey,
                    dataIndex: nameKey,
                    key: nameKey,
                },
                {
                    title: '数量',
                    dataIndex: valueKey,
                    key: valueKey,
                },
                {
                    title: '占比',
                    dataIndex: 'scale',
                    key: 'scale',
                },
            ];
            return (
                <div>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        bordered
                        size="small"
                        pagination={false}
                        rowKey={nameKey}
                    />
                </div>
            );
        } else {
            const sortData = _.sortBy(data, [
                function(o) {
                    return -o[valueKey];
                },
            ]);
            const pieData = sortData.splice(0, top);

            const otherNum =
                sortData.length > 0 ? sortData.map(i => i[valueKey]).reduce((i, j) => i + j) : 0;
            sortData.length > 0 &&
                pieData.push({
                    [nameKey]: 'other',
                    [valueKey]: otherNum,
                });
            const { DataView } = DataSet;
            const dv = new DataView();
            dv.source(pieData).transform({
                type: 'percent',
                field: valueKey,
                dimension: nameKey,
                as: 'percent',
            });
            const cols = {
                percent: {
                    formatter: val => {
                        val = (val * 100).toFixed(2) + '%';
                        return val;
                    },
                },
            };
            return (
                <div id={storeValueKey} onMouseLeave={this.onPlotLeave}>
                    <Chart
                        ref={c => (this.chart = c)}
                        height={300}
                        data={dv}
                        scale={cols}
                        padding={[50, 50, 10, 50]}
                        forceFit
                    >
                        <Coord type="theta" radius={0.75} />
                        <Axis name="percent" />
                        {/* <Legend position='right' offsetY={0} /> */}
                        <Tooltip
                            inPlot={false}
                            showTitle={false}
                            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
                        />
                        <Geom
                            type="intervalStack"
                            position="percent"
                            color={nameKey}
                            tooltip={[
                                `${nameKey}*percent`,
                                (nameKey, percent) => {
                                    percent =
                                        parseFloat(numeral(percent * 100).format('0.00')) + '%';
                                    return {
                                        name: nameKey,
                                        value: percent,
                                    };
                                },
                            ]}
                            style={{ lineWidth: 1, stroke: '#fff' }}
                        >
                            <Label
                                content="percent"
                                htmlTemplate={(val, item) => {
                                    return (
                                        '<span style="color:' +
                                        item.point.color +
                                        '"><span class="title">' +
                                        item.point[nameKey] +
                                        '</span><br><span>' +
                                        item.point[valueKey] +
                                        '</span><br><span>' +
                                        val +
                                        '</span></span>'
                                    );
                                }}
                            />
                        </Geom>
                    </Chart>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>{title}</div>
                </div>
            );
        }
    }
}
