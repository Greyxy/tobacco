import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Space, Select, Modal, Checkbox, Radio, message, Image, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useThemeToken } from '@/theme/hooks';
import tobaccoService from '@/api/services/tobaccoService';
import AsyncImage from '@/pages/components/asyncImage';

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
var queryObject = { status: '0' }
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
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [key, setKey] = useState()
  const [key1, setKey1] = useState()
  const [historyData, setHistoryData] = useState([])

  useEffect(() => {
    getRoomData(queryObject, pagination.current, pagination.pageSize)
  }, [])
  const getRoomData = (data, page, pageSize) => {
    tobaccoService.backgingFind({ status: data.status, currentPage: page, pageSize }).then(res => {
      setPagination({ ...pagination, current: page, pageSize, total: res.total })
      res = res.records
      let currentIndex = 0
      res.forEach(async (item: TableData) => {
        item.modifyTime = parseTime(item.modifyTime)
        item.createTime = parseTime(item.createTime)
        item.submitTime = parseTime(item.submitTime)
        item.startTime = parseTime(item.startTime)
        item.endTime = parseTime(item.endTime)
        if (item.imgs) {
          let imgs = JSON.parse(item.imgs)
          if (typeof imgs == 'object') {
            const imgUrls = await Promise.all(imgs.map((x: string) => tobaccoService.getImgUrl(x)))
            imgUrls.forEach(item => item.replace(' ', ''))
            item.imgs = imgUrls
          }
        }
        currentIndex = index
      })
      let timer = setInterval(() => {
        if (currentIndex = res.length - 1) {
          clearInterval(timer)
          setTableData(res)
          setKey(new Date().getTime())
        }
      }, 100)
      setKey(new Date().getTime())
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
    {
      title: '烟农',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.farmer?.name || ''}</span>
      }
    },
    {
      title: '采集人', key: 'collector', render: (record) => {
        return <span>{record?.collector?.name || ''}</span>
      }
    },
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
      render: ({ imgs }) => {
        if (!imgs) {
          return <span>暂无数据</span>
        }
        return <AsyncImage src={imgs} />;
      },

    },
    { title: '烤房绑定烟农', dataIndex: 'isMainFarmer', key: 'isMainFarmer' },

    { title: '烤房绑定填报人', dataIndex: 'isMainCollector', key: 'isMainCollector' },

    { title: '填报时间', dataIndex: 'submitTime', key: 'submitTime' },
    { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  ];
  const hisColumns = [
    {
      title: '审核状态', dataIndex: 'bakingDataStatus', key: 'bakingDataStatus', render: (text, record, index) => {
        switch (record.bakingDataStatus) {
          case 0: return '待审核';
          case 1: return '审核通过';
          case 2: return '审核失败';
          default: return record.bakingDataStatus;
        }
      }
    },
    {
      title: '烤房id', dataIndex: 'bakingDataId', key: 'bakingDataId', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.bakingDataId !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '开始时间', dataIndex: 'startTime', key: 'startTime', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.startTime !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '结束时间', dataIndex: 'endTime', key: 'endTime', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.endTime !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '烘烤天数', dataIndex: 'days', key: 'days', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.days !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '炕次', dataIndex: 'sequence', key: 'sequence', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.sequence !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '部位', dataIndex: 'part', key: 'part', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.part !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '烟农',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer'
      , render: (text, record, index) => {
        console.log(text, 'farmer')
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.farmer.name !== text.farmer.name) {
            return <span style={{ color: 'red' }}>{record?.farmer?.name}</span>;
          } else {
            return <span>{record?.farmer?.name}</span>;
          }
        } else {

          return <span>{record?.farmer?.name}</span>;
        }
      },

    },
    {
      title: '采集人', key: 'collector', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.collector.name !== text.collector.name) {
            return <span style={{ color: 'red' }}>{record?.collector?.name}</span>;
          } else {
            return <span>{record?.collector?.name}</span>;
          }
        } else {

          return <span>{record?.collector?.name}</span>;
        }
      },
    },
    {
      title: '夹烟工具', dataIndex: 'tool', key: 'tool', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.tool !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '总竿数', dataIndex: 'totalPoleAmount', key: 'totalPoleAmount', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.totalPoleAmount !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '总重量', dataIndex: 'totalWeight', key: 'totalWeight', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.totalWeight !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '抽样杆数', dataIndex: 'samplePoleAmount', key: 'samplePoleAmount', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.samplePoleAmount !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '抽样重量', dataIndex: 'sampleWeight', key: 'sampleWeight', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.sampleWeight !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '青杂重量', dataIndex: 'greenWeight', key: 'greenWeight', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.greenWeight !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '抽样重量', dataIndex: 'sampleTotalWeight', key: 'sampleTotalWeight', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.sampleTotalWeight !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '黄烟率', dataIndex: 'yellowRate', key: 'yellowRate', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.yellowRate !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {
          return <span>{text}</span>;
        }
      },
    },
    {
      title: '经度', dataIndex: 'longitude', key: 'longitude', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.longitude !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '纬度', dataIndex: 'latitude', key: 'latitude', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.latitude !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '图片',
      // dataIndex: 'imgs',
      key: 'imgs',
      render: ({ imgs }) => {
        if (!imgs) {
          return <span>暂无数据</span>
        }
        return <AsyncImage src={imgs} />;
      },

    },
    {
      title: '烤房绑定烟农', dataIndex: 'isMainFarmer', key: 'isMainFarmer', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.isMainFarmer !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '烤房绑定填报人', dataIndex: 'isMainCollector', key: 'isMainCollector', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.isMainCollector !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '填报时间', dataIndex: 'submitTime', key: 'submitTime', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.submitTime !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    {
      title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime', render: (text, record, index) => {
        if (index === 0) {
          const prevRow = historyData[index + 1];
          if (prevRow && prevRow.modifyTime !== text) {
            return <span style={{ color: 'red' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        } else {

          return <span>{text}</span>;
        }
      },
    },
    // {
    //   title: '创建时间', dataIndex: 'createTime', key: 'createTime', render: (text, record, index) => {
    //     if (index === 0) {
    //       const prevRow = historyData[index + 1];
    //       if (prevRow && prevRow.startTime !== text) {
    //         return <span style={{ color: 'red' }}>{text}</span>;
    //       } else {
    //         return <span>{text}</span>;
    //       }
    //     } else {

    //       return <span>{text}</span>;
    //     }
    //   },
    // },
  ]
  columns.forEach(item => item.align = 'center')
  const onFinish = (values: any) => {
    setStatus(values.status)
    getRoomData(values, pagination.current, pagination.pageSize)
  };

  const { colorPrimary } = useThemeToken()
  const reviewHandle = (record: TableData) => {
    setSelectedRow(record)
    setIsModalVisible(true);
    // 请求历史数据
    tobaccoService.getHistoryBakingData({ bakingDataId: record.bakingDataId }).then(res => {
      let currentIndex = 0
      res.forEach(async (item: TableData, index) => {
        if (item.modifyTime)
          item.modifyTime = parseTime(item.modifyTime)
        if (item.createTime)
          item.createTime = parseTime(item.createTime)
        if (item.submitTime)
          item.submitTime = parseTime(item.submitTime)
        if (item.startTime)
          item.startTime = parseTime(item.startTime)
        if (item.endTime)
          item.endTime = parseTime(item.endTime)

        if (item.imgs) {
          let imgs = JSON.parse(item.imgs)
          if (typeof imgs == 'object') {
            const imgUrls = await Promise.all(imgs.map((x: string) => tobaccoService.getImgUrl(x)))
            imgUrls.forEach(item => item.replace(' ', ''))
            item.imgs = imgUrls
          }
        }
        currentIndex = index
      })
      let timer = setInterval(() => {
        if (currentIndex = res.length - 1) {
          clearInterval(timer)
          setHistoryData(res)
          setKey1(new Date().getTime())
        }
      }, 100)
      setKey1(new Date().getTime())

      setHistoryData(res)
    })
  }
  const onReviewFinish = (values) => {
    let id = selectedRow.id
    if (values.status == 'approved') {
      tobaccoService.reviewBacking(id + '').then(res => {
        getRoomData(status, pagination.current, pagination.pageSize)
        setIsModalVisible(false)
        messageApi.open({
          type: 'success',
          content: '审核成功',
        });
      })
    } else {
      tobaccoService.refuseBacking(id + '').then(res => {
        getRoomData(status, pagination.current, pagination.pageSize)
        setIsModalVisible(false)
        messageApi.open({
          type: 'success',
          content: '审核成功',
        });
      })
    }

  };
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const handleOk = () => {
    setIsModalVisible(false);
  }
  const handleTableChange = (pagination: any) => {
    getRoomData(queryObject, pagination.current, pagination.pageSize)
  }
  return (
    <>
      {contextHolder}
      <div>
        <Form
          name="search_form"
          layout="inline"
          onFinish={onFinish}
          initialValues={queryObject}
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
          key={key}
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          className='whitespace-nowrap mt-6'
          scroll={{ x: true }}
          onChange={handleTableChange}
          pagination={pagination}
        />
      </div>
      <Modal title='审核数据' open={isModalVisible} footer={null} centered={true} onOk={handleOk} width={1200}
        onCancel={handleCancel}>
        <Form onFinish={onReviewFinish} initialValues={{ status: '1' }}>
          <Row gutter={16}>
            <Col>
              <Form.Item name="status">
                <Radio.Group>
                  <Radio value="1">审核通过</Radio>
                  <Radio value="2">审核不通过</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row >

        </Form>
        <div className="w-96%  border border-solid border-gray-300 m-5px mx-2%"></div>
        <Table
          dataSource={historyData}
          columns={hisColumns}
          key={key1}
          rowKey="id"
          className='whitespace-nowrap mt-6'
          scroll={{ x: true }} />
      </Modal>
    </>
  );
}
