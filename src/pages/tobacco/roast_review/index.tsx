import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Space, Select, Modal, Checkbox, Radio, message, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useThemeToken } from '@/theme/hooks';
import tobaccoService from '@/api/services/tobaccoService';
const { Option } = Select;
interface TableData {
  id: number;
  bakingDataStatus: number,
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
  bakingDataId: number;
  remark: string;
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
export default function index() {
  const [tableData, setTableData] = useState<TableData[]>([])
  const [status, setStatus] = useState<string>('0')
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableData>()
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getRoomData(status)
  }, [])
  const getRoomData = (status: string) => {
    tobaccoService.backgingFind(status).then(res => {
      res.forEach((item: TableData) => {
        item.modifyTime = parseTime(item.modifyTime)
        item.createTime = parseTime(item.createTime)
        item.submitTime = parseTime(item.submitTime)
        item.startTime = parseTime(item.startTime)
        item.endTime = parseTime(item.endTime)
      })
      setTableData(res)
    })
  }
  const columns: ColumnsType<TableData> = [
    {
      title: '操作',
      key: 'action',
      fixed: 'left',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button type="link" style={{ color: colorPrimary }} onClick={() => reviewHandle(record)}>审核</Button>
        </Space>
      ),
    },
    // { title: 'id', dataIndex: 'id', key: 'id' },
    {
      title: '审核状态', dataIndex: 'bakingDataStatus', key: 'bakingDataStatus', render: (text, record) => {
        console.log(record.bakingDataStatus, typeof record.bakingDataStatus)
        switch (record.bakingDataStatus) {
          case 0: return '待审核';
          case 1: return '审核通过';
          case 2: return '审核失败';
          default: return record.bakingDataStatus;
        }
      }
    },
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
    { title: '烤房绑定烟农', dataIndex: 'isMainFarmer', key: 'isMainFarmer' },
    { title: '烟农id', dataIndex: 'farmerId', key: 'farmerId' },
    { title: '烤房绑定填报人', dataIndex: 'isMainCollector', key: 'isMainCollector' },
    { title: '采集人id', dataIndex: 'collectorId', key: 'collectorId' },
    { title: '填报时间', dataIndex: 'submitTime', key: 'submitTime' },
    { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];
  columns.forEach(item => item.align = 'center')
  const onFinish = (values: any) => {
    setStatus(values.status)
    getRoomData(values.status)
  };

  const { colorPrimary } = useThemeToken()
  const reviewHandle = (record: TableData) => {
    setSelectedRow(record)
    setIsModalVisible(true);

  }
  const onReviewFinish = (values) => {
    let id = selectedRow.id
    if (values.status == 'approved') {
      tobaccoService.reviewBacking(id + '').then(res => {
        getRoomData(status)
        setIsModalVisible(false)
        messageApi.open({
          type: 'success',
          content: '审核成功',
        });
      })
    } else {
      tobaccoService.refuseBacking(id + '').then(res => {
        getRoomData(status)
        setIsModalVisible(false)
        messageApi.open({
          type: 'success',
          content: '审核成功',
        });
      })
    }

  };

  return (
    <>
      {contextHolder}
      <div>
        <Form
          name="search_form"
          layout="inline"
          onFinish={onFinish}
          initialValues={{ status: '0' }}
        >
          <Form.Item
            name="status"
            label="状态"
          >
            <Select placeholder='请选择审核状态' style={{ width: 200 }}>
              <Option value="0">待审核</Option>
              <Option value="1">审核通过</Option>
              <Option value="2">审核不通过</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" >
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
        />
      </div>
      <Modal title='审核数据' open={isModalVisible} footer={null} centered={true}>
        <Form onFinish={onReviewFinish} initialValues={{ status: '1' }}>
          <Form.Item name="status">
            <Radio.Group>
              <Radio value="1">审核通过</Radio>
              <Radio value="2">审核不通过</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
