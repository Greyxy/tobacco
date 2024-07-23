import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Space, Select, DatePicker, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useThemeToken } from '@/theme/hooks';
import tobaccoService from '@/api/services/tobaccoService';
const { Option } = Select;
interface TableData {
  id: string;
  roomId: number;
  startTime: string; // datetime
  endTime: string; // datetime
  days: number;
  sequence: number;
  part: string;
  tool: string;
  totalPoleAmount: number;
  totalWeight: number;
  samplePoleAmount: number;
  sampleWeight: number;
  greenWeight: number;
  sampleTotalWeight: number;
  yellowRate: number;
  longitude: number;
  latitude: number;
  imgs: string;
  isMainFarmer: number;
  farmerId: number;
  isMainCollector: number;
  collectorId: number;
  submitTime: string; // datetime
  modifyTime: string; // datetime
  createTime: string; // datetime
}
function parseTime(data) {
  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate
}
const queryObject = {
  roomId: "",
  startTime: "",
  endTime: "",
  farmerId: "",
  collectorId: ""
};

const labels = {
  roomId: "房间id",
  startTime: "开始时间",
  endTime: "结束时间",
  farmerId: "烟农id",
  collectorId: "采集人id"
};

export default function index() {
  const columns: ColumnsType<TableData> = [
    { title: '烤房id', dataIndex: 'roomId', key: 'roomId' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { title: '烘烤天数', dataIndex: 'days', key: 'days' },
    { title: '炕次', dataIndex: 'sequence', key: 'sequence' },
    { title: '部位', dataIndex: 'part', key: 'part' },
    { title: '夹烟工具', dataIndex: 'tool', key: 'tool' },
    { title: '总竿数', dataIndex: 'totalPoleAmount', key: 'totalPoleAmount' },
    { title: '总重量', dataIndex: 'totalWeight', key: 'totalWeight' },
    { title: '抽样杆数', dataIndex: 'samplePoleAmount', key: 'samplePoleAmount' },
    { title: '抽样重量', dataIndex: 'sampleWeight', key: 'sampleWeight' },
    { title: '青杂重量', dataIndex: 'greenWeight', key: 'greenWeight' },
    { title: '抽样重量', dataIndex: 'sampleTotalWeight', key: 'sampleTotalWeight' },
    { title: '黄烟率', dataIndex: 'yellowRate', key: 'yellowRate' },
    { title: '经度', dataIndex: 'longitude', key: 'longitude' },
    { title: '纬度', dataIndex: 'latitude', key: 'latitude' },
    {
      title: '图片',
      key: 'imgs',
      render: (text: string, record) => {
        if (!record.imgs) {
          return <span>暂无数据</span>
        } else if (typeof record.imgs == 'string') {
          return <Image src={record.imgs} alt="img" width={100} />
        } else {
          return <Image.PreviewGroup items={record.imgs}>
            <Image width={100} src={record.imgs[0]} />
          </Image.PreviewGroup>
        }
      },
    },
    { title: '烤房绑定烟农', dataIndex: 'isMainFarmer', key: 'isMainFarmer' },
    { title: '烟农id', dataIndex: 'farmerId', key: 'farmerId' },
    { title: '烤房绑定填报人', dataIndex: 'isMainCollector', key: 'isMainCollector' },
    { title: '采集人id', dataIndex: 'collectorId', key: 'collectorId' },
    { title: '填报时间', dataIndex: 'submitTime', key: 'submitTime' },
    { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];

  columns.forEach(item => item.align = 'center')
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // console.log('Form values:', values, queryObject);
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
    };
    console.log(formattedValues)
    getRoomData(formattedValues)
  };
  const [tableData, setTableData] = useState<TableData[]>([])
  const [roomIdList, setRoomIdList] = useState<String[]>([])
  const [farmerIdList, setFarmerIdList] = useState([])
  const [collectorIdList, setCollectIdList] = useState([])
  useEffect(() => {
    getRoomData(queryObject)
  }, [])
  const getRoomData = (data: any) => {
    tobaccoService.backingQuery(data).then(res => {
      res.forEach((item: TableData) => {
        item.modifyTime = parseTime(item.modifyTime)
        item.createTime = parseTime(item.createTime)
        item.submitTime = parseTime(item.submitTime)
        item.startTime = parseTime(item.startTime)
        item.endTime = parseTime(item.endTime)
      })
      setTableData(res)
      setRoomIdList(res.map((x: TableData) => x.roomId))
      setFarmerIdList(res.map((x: TableData) => x.farmerId))
      setCollectIdList(res.map((x: TableData) => x.collectorId))
    })
  }
  return (
    <div>
      <Form
        form={form}
        name="dynamic_form"
        onFinish={onFinish}
        initialValues={queryObject}
        layout="inline"
      >
        <Form.Item label="房间id" name='roomId'>
          <Select allowClear={true} style={{ width: 200 }}>
            {
              roomIdList.map((x, index) => {
                return <Option key={index} value={x}>{x}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="开始时间" name='startTime'>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="结束时间" name='endTime'>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="烟农id" name='farmerId'>
          <Select allowClear={true} style={{ width: 200 }}>
            {
              farmerIdList.map((x, index) => {
                return <Option key={index} value={x}>{x}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item label="采集人id" name='collectorId'>
          <Select allowClear={true} style={{ width: 200 }}>
            {
              collectorIdList.map((x, index) => {
                return <Option key={index} value={x}>{x}</Option>
              })
            }
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        className='whitespace-nowrap mt-6'
        scroll={{ x: true }}
        pagination={{
          pageSize: 5,
          total: tableData.length,
          showQuickJumper: true,
          showTotal: _ => `共${tableData.length}条`
        }}
      />
    </div>
  );
}
