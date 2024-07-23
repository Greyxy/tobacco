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
    { title: '烤房id', dataIndex: 'room_id', key: 'room_id' },
    { title: '开始时间', dataIndex: 'start_time', key: 'start_time' },
    { title: '结束时间', dataIndex: 'end_time', key: 'end_time' },
    { title: '烘烤天数', dataIndex: 'days', key: 'days' },
    { title: '炕次', dataIndex: 'sequence', key: 'sequence' },
    { title: '部位', dataIndex: 'part', key: 'part' },
    { title: '夹烟工具', dataIndex: 'tool', key: 'tool' },
    { title: '总竿数', dataIndex: 'total_pole_amount', key: 'total_pole_amount' },
    { title: '总重量', dataIndex: 'total_weight', key: 'total_weight' },
    { title: '抽样杆数', dataIndex: 'sample_pole_amount', key: 'sample_pole_amount' },
    { title: '抽样重量', dataIndex: 'sample_weight', key: 'sample_weight' },
    { title: '青杂重量', dataIndex: 'green_weight', key: 'green_weight' },
    { title: '抽样重量', dataIndex: 'sample_total_weight', key: 'sample_total_weight' },
    { title: '黄烟率', dataIndex: 'yellow_rate', key: 'yellow_rate' },
    { title: '经度', dataIndex: 'longitude', key: 'longitude' },
    { title: '纬度', dataIndex: 'latitude', key: 'latitude' },
    {
      title: '图片',
      // dataIndex: 'imgs',
      key: 'imgs',
      render: (text: string, record) => {
        if (!record.imgs) {
          return <span>暂无数据</span>
        } else if (typeof record.imgs == 'string') {
          return <Image src={record.imgs} alt="img" width={100} />
        } else {
          // 数组
          return <Image.PreviewGroup
            items={record.imgs}
          >
            <Image
              width={100}
              src={record.imgs[0]}
            />
          </Image.PreviewGroup>
        }
      },
    },
    { title: '烤房绑定烟农', dataIndex: 'is_main_farmer', key: 'is_main_farmer' },
    { title: '烟农id', dataIndex: 'farmer_id', key: 'farmer_id' },
    { title: '烤房绑定填报人', dataIndex: 'is_main_collector', key: 'is_main_collector' },
    { title: '采集人id', dataIndex: 'collector_id', key: 'collector_id' },
    { title: '填报时间', dataIndex: 'submit_time', key: 'submit_time' },
    { title: '修改时间', dataIndex: 'modify_time', key: 'modify_time' },
    { title: '创建时间', dataIndex: 'create_time', key: 'create_time' },
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
    getRoomData(formattedValues)
  };
  const [tableData, setTableData] = useState<TableData[]>([])
  const [roomIdList, setRoomIdList] = useState<String[]>([])
  const [farmerIdList, setFarmerIdList] = useState([])
  const [collectorIdList, setCollectIdList] = useState([])
  useEffect(() => {
    getRoomData(queryObject)
  }, [])
  const getRoomData = (data) => {
    tobaccoService.backingQuery(data).then(res => {
      res.forEach((item: TableData) => {
        item.modifyTime = parseTime(item.modifyTime)
        item.createTime = parseTime(item.createTime)
        item.submitTime = parseTime(item.submitTime)
        item.startTime = parseTime(item.startTime)
        item.endTime = parseTime(item.endTime)
      })
      setTableData(res)
      setRoomIdList(res.map((x: TableData) => x.id))
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
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        className='whitespace-nowrap mt-6'
        scroll={{ x: true }}
      />
    </div>
  );
}
