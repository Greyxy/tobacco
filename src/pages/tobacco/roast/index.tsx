import tobaccoService from '@/api/services/tobaccoService';
import AsyncImage from '@/pages/components/asyncImage';
import { useThemeToken } from '@/theme/hooks';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './index.css'
const { Option } = Select;

function parseTime(data) {
  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
}
var queryObject = {
  // roomId: "",
  // startTime: '',
  // endTime: '',
  // farmerName: '',
  // collectorName: '',

  collectorName: "",
  currentPage: 1,
  endTime: null,
  endTimeStamp: null,
  farmerName: "",
  pageSize: 10,
  roomId: "",
  startTime: null,
  startTimeStamp: null,
  "sortOrders": [
    // {
    //   "field": "start_time",
    //   "order": 0
    // },
    // {
    //   "field": "end_time",
    //   "order": 0
    // }, {
    //   "field": "submit_time",
    //   "order": 0
    // }, {
    //   "field": "sample_weight",
    //   "order": 0
    // }, {
    //   "field": "green_weight",
    //   "order": 0
    // }, {
    //   "field": "sample_total_weight",
    //   "order": 0
    // }, {
    //   "field": "total_weight",
    //   "order": 0
    // }
  ]
};
var originFarmerList = [];
var originCollectorList = [];
export default function index() {
  const { colorPrimary } = useThemeToken();
  const [sortedStartTimeInfo, setSortedStartTimeInfo] = useState({
    columnKey: '',
    order: ''
  });
  const [sortedEndTimeInfo, setSortedEndTimeInfo] = useState({
    columnKey: '',
    order: ''
  });
  const [sortedSubmitTimeInfo, setSortedSubmitTimeInfo] = useState({
    columnKey: '',
    order: ''
  });
  // const [sortedDaysInfo, setSortedDaysInfo] = useState({
  //   columnKey: '',
  //   order: ''
  // });
  const [sortedTotalWeightInfo, setSortedTotalWeightInfo] = useState({
    columnKey: '',
    order: ''
  });
  const [sortedSamplePoleAmountInfo, setSortedSamplePoleAmountInfo] = useState({
    columnKey: '',
    order: ''
  });
  const [sortedSampleWeightInfo, setSortedSampleWeightInfo] = useState({
    columnKey: '',
    order: ''
  });


  const [sortedGreenWeightInfo, setSortedGreenWeightInfo] = useState({
    columnKey: '',
    order: ''
  });
  const [sortedsSampleTotalWeightInfo, setSortedSampleTotalWeightInfo] = useState({
    columnKey: '',
    order: ''
  });
  const [sortedYellowRateInfo, setSortedYellowRateInfo] = useState({
    columnKey: '',
    order: ''
  });
  const columns = [
    {
      title: '操作',
      key: 'action',
      fixed: 'left',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)} style={{ color: colorPrimary }}>
            修改
          </Button>
          <Button type="link" onClick={() => handleDelete(record)} style={{ color: colorPrimary }}>
            删除
          </Button>
        </Space>
      ),
    },
    { title: '烤房id', dataIndex: 'roomId', key: 'roomId', },
    { title: '烤房编码', dataIndex: 'roomCode', key: 'roomCode', },
    {
      title: '烟农',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.farmer?.name || ''}</span>;
      },
    },
    {
      title: '采集人',
      key: 'collector',
      render: (record) => {
        return <span>{record?.collector?.name || ''}</span>;
      },
    },
    {
      title: '开始烘烤时间', dataIndex: 'startTime', key: 'startTime',
      //  sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime)
      sorter: true,
      sortOrder: sortedStartTimeInfo.columnKey === 'startTime' && sortedStartTimeInfo.order,

    },
    {
      title: '结束烘烤时间', dataIndex: 'endTime', key: 'endTime',
      // sorter: (a, b) => new Date(a.endTime) - new Date(b.endTime) 
      sorter: true,
      sortOrder: sortedEndTimeInfo.columnKey === 'endTime' && sortedEndTimeInfo.order,

    },
    // { title: '开始填报时间', dataIndex: 'startTimeStamp', key: 'startTimeStamp', sorter: (a, b) => new Date(a.startTimeStamp) - new Date(b.startTimeStamp) },
    // { title: '结束填报时间', dataIndex: 'endTimeStamp', key: 'endTimeStamp', sorter: (a, b) => new Date(a.endTimeStamp) - new Date(b.endTimeStamp) },
    {
      title: '填报时间', dataIndex: 'submitTime', key: 'submitTime',
      //  sorter: (a, b) => new Date(a.submitTime) - new Date(b.submitTime) 
      sorter: true,
      sortOrder: sortedSubmitTimeInfo.columnKey === 'submitTime' && sortedSubmitTimeInfo.order,

    },

    {
      title: '烘烤天数', dataIndex: 'days', key: 'days',
      //  sorter: (a, b) => a.days - b.days, 
      // sorter: true,
      // sortOrder: sortedDaysInfo.columnKey === 'days' && sortedDaysInfo.order,

    },
    { title: '炕次', dataIndex: 'sequence', key: 'sequence' },
    { title: '部位', dataIndex: 'part', key: 'part' },

    {
      title: '烟农手机号',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.farmer?.phoneNumber || ''}</span>;
      },
    },
    {
      title: '烟农身份证号',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.farmer?.idNumber || ''}</span>;
      },
    },

    {
      title: '采集人手机号',
      key: 'collector',
      render: (record) => {
        return <span>{record?.collector?.phoneNumber || ''}</span>;
      },
    },
    {
      title: '采集人身份证号',
      // dataIndex: 'farmer.farmerName',
      key: 'collector',
      render: (record) => {
        return <span>{record?.collector?.idNumber || ''}</span>;
      },
    },
    { title: '县城', dataIndex: 'county', key: 'county' },
    { title: '烟站名称', dataIndex: 'stationName', key: 'stationName' },
    { title: '夹烟工具', dataIndex: 'tool', key: 'tool' },
    { title: '总竿数', dataIndex: 'totalPoleAmount', key: 'totalPoleAmount' },
    {
      title: '总黄烟重量', dataIndex: 'totalWeight', key: 'totalWeight',
      // sorter: (a, b) => a.totalWeight - b.totalWeight, 
      sorter: true,
      sortOrder: sortedTotalWeightInfo.columnKey === 'totalWeight' && sortedTotalWeightInfo.order,

    },
    {
      title: '抽样杆数', dataIndex: 'samplePoleAmount', key: 'samplePoleAmount',
      // sorter: (a, b) => a.samplePoleAmount - b.samplePoleAmount,
      sorter: true,
      sortOrder: sortedSamplePoleAmountInfo.columnKey === 'samplePoleAmount' && sortedSamplePoleAmountInfo.order,

    },
    {
      title: '抽样黄烟重量', dataIndex: 'sampleWeight', key: 'sampleWeight',
      //  sorter: (a, b) => a.sampleWeight - b.sampleWeight, 
      sorter: true,
      sortOrder: sortedSampleWeightInfo.columnKey === 'sampleWeight' && sortedSampleWeightInfo.order,

    },
    {
      title: '抽样青杂重量', dataIndex: 'greenWeight', key: 'greenWeight',
      //  sorter: (a, b) => a.greenWeight - b.greenWeight,
      sorter: true,
      sortOrder: sortedGreenWeightInfo.columnKey === 'greenWeight' && sortedGreenWeightInfo.order,

    },
    {
      title: '抽样总黄烟重量', dataIndex: 'sampleTotalWeight', key: 'sampleTotalWeight',
      // sorter: (a, b) => a.sampleTotalWeight - b.sampleTotalWeight, 
      sorter: true,
      sortOrder: sortedsSampleTotalWeightInfo.columnKey === 'sampleTotalWeight' && sortedsSampleTotalWeightInfo.order,

    },
    {
      title: '黄烟率', dataIndex: 'yellowRate', key: 'yellowRate',
      // sorter: (a, b) => a.yellowRate - b.yellowRate, 
      sorter: true,
      sortOrder: sortedYellowRateInfo.columnKey === 'yellowRate' && sortedYellowRateInfo.order,

    },
    { title: '经度', dataIndex: 'longitude', key: 'longitude' },
    { title: '纬度', dataIndex: 'latitude', key: 'latitude' },
    {
      title: '图片',
      // dataIndex: 'imgs',
      key: 'imgs',
      render: ({ imgs }) => {
        if (!imgs) {
          return <span>暂无数据</span>;
        }
        return <AsyncImage src={imgs} />;
      },
    },
    {
      title: '烤房绑定烟农',
      dataIndex: 'isMainFarmer',
      key: 'isMainFarmer',
      render: (record) => {
        return record.isMainFarmer == 1 ? <span>是</span> : <span>否</span>;
      },
    },

    {
      title: '烤房绑定填报人',
      dataIndex: 'isMainCollector',
      key: 'isMainCollector',
      render: (record) => {
        return record.isMainCollector == 1 ? <span>是</span> : <span>否</span>;
      },
    },
    // updateReason
    { title: '修改原因', dataIndex: 'updateReason', key: 'updateReason' },
  ];

  columns.forEach((item) => (item.align = 'center'));
  const [editForm] = Form.useForm();

  const handleEdit = (record) => {
    let obj = JSON.parse(JSON.stringify(record));
    obj.startTime = dayjs(obj.startTime, 'YYYY-MM-DD');
    obj.endTime = dayjs(obj.endTime, 'YYYY-MM-DD');
    console.log(obj);
    // obj.updateReason = '';
    setEditingRecord(obj);
    editForm.resetFields();
  };
  const handleDelete = (reccord) => {
    tobaccoService.backingDelete({ id: reccord.id }).then((res) => {
      messageApi.open({
        type: 'success',
        content: '删除成功',
      });
      getRoomData(queryObject, pagination.current, pagination.pageSize);
    });
  };
  const onFinish = (values: any) => {
    // console.log('Form values:', values, queryObject);
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
      startTimeStamp: values.startTimeStamp ? values.startTimeStamp.format('YYYY-MM-DD') : null,
      endTimeStamp: values.endTimeStamp ? values.endTimeStamp.format('YYYY-MM-DD') : null,

      roomId: '',
    };
    queryObject = formattedValues;
    getRoomData(formattedValues, 1, pagination.pageSize);
    setPagination({ ...pagination, current: 1 });
  };
  const [tableData, setTableData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [key, setKey] = useState();
  const [cityList, setCityList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [editingRecord, setEditingRecord] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [farmerList, setFarmerList] = useState([]);
  const [collectorList, setCollectorList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  useEffect(() => {
    getRoomData(queryObject, pagination.current, pagination.pageSize);
    getCityList();
    getFarmerList();
    getCollectorList();
  }, []);
  useEffect(() => {
    editForm.resetFields();
    if (editingRecord.roomId) {
      setIsModalVisible(true);
      editForm.setFieldsValue(editingRecord);
    }
  }, [editingRecord]);
  const getRoomData = (data: any, page: number, pageSize: number) => {
    debugger
    tobaccoService.backingQuery({ ...data, currentPage: page, pageSize }).then((res) => {
      setPagination({ ...pagination, current: page, pageSize, total: res.total });
      res = res.records || [];
      let currentIndex = 0;
      res.forEach(async (item, index) => {
        item.submitTime = parseTime(item.submitTime);
        item.startTime = parseTime(item.startTime);
        item.endTime = parseTime(item.endTime);
        if (item.imgs) {
          let imgs = JSON.parse(item.imgs);
          if (typeof imgs == 'object') {
            const imgUrls = await Promise.all(imgs.map((x: string) => tobaccoService.getImgUrl(x)));
            imgUrls.forEach((item) => item.replace(' ', ''));
            item.imgs = imgUrls;
          }
        }
        currentIndex = index;
      });
      let timer = setInterval(() => {
        if ((currentIndex = res.length - 1)) {
          console.log(res);
          clearInterval(timer);
          setTableData(res);
          setKey(new Date().getTime());
        }
      }, 100);
      setTableData(res);
    });
  };
  // 获取受益人列表和采集人列表
  const getFarmerList = () => {
    tobaccoService.getFarmerByQuery({ page: 1, size: 1000 }).then((res) => {
      setFarmerList(res.records || []);
      originFarmerList = res.records || [];
    });
  };
  const getCollectorList = () => {
    tobaccoService.getCollectorByQuery({ page: 1, size: 1000 }).then((res) => {
      setCollectorList(res.records || []);
      originCollectorList = res.records || [];
    });
  };
  const handleTableChange = (paginations: any, filters, sorter) => {
    console.log(paginations, filters, sorter)
    if (pagination.current !== paginations.current || paginations.pageSize !== pagination.pageSize)
      getRoomData(queryObject, paginations.current, paginations.pageSize);

    if (JSON.stringify(sorter) !== '{}') {
      // setSortedInfo(sorter);
      // 0 升序 1降序
      let value = sorter.order == 'descend' ? 1 : sorter.order == 'ascend' ? 0 : 0
      let key = '';

      switch (sorter.columnKey) {
        case 'startTime':
          key = 'start_time';

          setSortedStartTimeInfo(sorter); break;
        case 'endTime':
          key = 'end_time';

          setSortedEndTimeInfo(sorter); break;
        case 'submitTime':
          key = 'submit_time';

          setSortedSubmitTimeInfo(sorter); break;
        case 'sampleWeight':
          key = 'sample_weight';
          setSortedSampleWeightInfo(sorter); break;
        case 'greenWeight':
          key = 'start_weight';
          setSortedGreenWeightInfo(sorter); break;
        case 'sampleTotalWeight':
          key = 'sample_total_weight';
          setSortedSampleTotalWeightInfo(sorter); break;
        case 'totalWeight':
          key = 'total_weight';
          setSortedTotalWeightInfo(sorter); break;
        // case 'days':
        //   key = 'days';
        //   setSortedDaysInfo(sorter); break;
        case 'samplePoleAmount':
          key = 'sample_pole_amount';
          setSortedSamplePoleAmountInfo(sorter); break;
        default:
          key = '';
      }
      let index = queryObject.sortOrders.findIndex(item => {
        // if (item.field == key) {
        //   item.order = value
        // } else {
        //   item.order = 0
        // }
        return item.field == key
      })
      if (index != -1) {
        queryObject.sortOrders[index].order = value
      } else {
        queryObject.sortOrders.push
          ({
            field: key,
            order: value
          })

      }
      // queryObject.sortOrders = [
      //   {
      //     field: key,
      //     order: value
      //   }
      // ]
      getRoomData(queryObject, pagination.current, pagination.pageSize);
      return
    }

  };
  const getCityList = () => {
    tobaccoService.getCountry().then((res) => {
      if (res) setCityList(res);
    });
  };
  const changeCountry = (value) => {
    console.log(value);
    if (value) {
      tobaccoService.getStation({ county: value }).then((res) => {
        setStationList(res);
      });
    } else {
      setStationList([]);
    }
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleFinish = (values) => {
    let obj = {
      ...values,
      id: editingRecord.id,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
    };
    // obj.yellowWeight = 0;
    obj.sampleWeight = Number(obj.sampleWeight);
    obj.greenWeight = Number(obj.greenWeight);
    // obj.sampleTotalWeight = obj.sampleWeight + obj.greenWeight;
    // obj.totalWeight = (obj.sampleTotalWeight / 10) * obj.samplePoleAmount;
    // obj.yellowRate = (obj.sampleWeight / obj.totalWeight).toFixed(2);
    tobaccoService.updatebacking(obj).then((res) => {
      if (res) {
        message.open({
          type: 'success',
          content: '修改烘烤数据成功',
        });
        getRoomData(queryObject, pagination.current, pagination.pageSize);
        setIsModalVisible(false);
      }
    });
  };
  const changeDate = () => {
    // console.log('onChange');
    let startTime = editForm.getFieldValue('startTime');
    let endTime = editForm.getFieldValue('endTime');
    if (startTime && endTime)
      editForm.setFieldValue(
        'days',
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / 3600 / 24 / 1000,
      );
  };
  const calculate = () => {
    let greenWeight = editForm.getFieldValue('greenWeight');
    let sampleWeight = editForm.getFieldValue('sampleWeight');
    let totalPoleAmount = editForm.getFieldValue('totalPoleAmount');
    if (greenWeight && totalPoleAmount && sampleWeight) {
      console.log(greenWeight, totalPoleAmount, sampleWeight);
      let sampleTotalWeight = Number(sampleWeight) + Number(greenWeight);
      let totalWeight = (sampleWeight / 10) * totalPoleAmount;
      let yellowRate = ((sampleWeight / sampleTotalWeight) * 100).toFixed(2);
      editForm.setFieldValue('sampleTotalWeight', sampleTotalWeight);
      editForm.setFieldValue('totalWeight', totalWeight);
      editForm.setFieldValue('yellowRate', yellowRate);
    }
  }
  const onSelectChange = (newSelectedRowKeys) => {
    console.log(newSelectedRowKeys)
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const exportData = async () => {
    const token = JSON.parse(localStorage.getItem('token') || '{}').accessToken;

    const response = await fetch(window.config.baseUrl + 'api/excel/download', {
      method: 'post',
      headers: {
        Token: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(queryObject),
    });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '烘烤数据.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // let headers = columns.map(x => x.title)
    // let data = tableData.filter(x => selectedRowKeys.includes(x.id))
    // const dataWithHeaders = [
    //   headers,
    //   // ...data.map(item => [item])
    //   ...data.map(item => columns.map(col => {
    //     if (item[col.key]) {

    //       if (col.title == '烟农') {
    //         return item[col.key].name
    //       }
    //       else if (col.title == '烟农手机号') return item[col.key].phoneNumber
    //       else if (col.title == '烟农身份证号') return item[col.key].idNumber
    //       else if (col.title == '采集人') return item[col.key].name
    //       else if (col.title == '采集人手机号') return item[col.key].phoneNumber
    //       else if (col.title == '采集人身份证号') return item[col.key].idNumber
    //       else return item[col.key]
    //     } else return ''
    //   }))
    // ];
    // console.log(dataWithHeaders, 'dataWithHeaders')
    // // 将二维数组转换为工作表
    // const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    // // const ws = XLSX.utils.json_to_sheet(data, { header: headers });
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, '烘烤数据.xlsx');
  }
  const handleSelectChange = (value) => {
    if (value === '其他') {
      setIsOtherSelected(true);
    } else {
      setIsOtherSelected(false);
    }
  };
  const handleInputBlur = (value) => {
    if (editForm.getFieldValue('updateReason') === '') {
      setIsOtherSelected(false);
    }
  };
  return (
    <div>
      {contextHolder}

      <div className="flex justify-between">
        <Form
          form={form}
          name="dynamic_form"
          onFinish={onFinish}
          initialValues={queryObject}
          layout="inline"
        >
          <Form.Item label="开始烘烤时间" name="startTime" style={{ marginTop: '5px' }}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="结束烘烤时间" name="endTime" style={{ marginTop: '5px' }}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="开始填报时间" name="startTimeStamp" style={{ marginTop: '5px' }}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="结束填报时间" name="endTimeStamp" style={{ marginTop: '5px' }}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="烟农" name="farmerName" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item name="farmerPhone" label="烟农手机号" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item name="farmerIDCard" label="烟农身份证号" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item label="采集人" name="collectorName" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item name="collectorPhone" label="采集人手机号" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item name="collectorIDCard" label="采集人身份证号" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item label="县公司" name="county" style={{ marginTop: '5px' }}>
            <Select style={{ width: 200 }} onChange={changeCountry} allowClear>
              {cityList.map((x) => (
                <Option key={x} value={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="烟站名称" name="stationName" style={{ marginTop: '5px' }}>
            {/* <Input allowClear={true} /> */}
            <Select style={{ width: 200 }} allowClear>
              {stationList.map((x) => (
                <Option key={x} value={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginTop: '5px' }}>
              查询
            </Button>
          </Form.Item>
          <Form.Item style={{ marginTop: '5px' }}>
            <span className="font-semibold text-red-600">总条数：{pagination.total}条</span>
          </Form.Item>
        </Form>
        <div>
          <Button type="primary" onClick={exportData} className="mx-5">
            导出数据
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        key={key}
        className="mt-6 whitespace-nowrap custom-row"
        scroll={{ x: true }}
        onChange={handleTableChange}
        pagination={pagination}
        rowSelection={rowSelection} // 添加复选框
        rowClassName={() => 'custom-row'}
      />
      {/* 修改表单 */}
      < Modal
        title="修改数据"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        centered={true}
      >
        <Form initialValues={editingRecord || {}} onFinish={handleFinish} form={editForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="startTime" label="开始烘烤时间">
                <DatePicker format={'YYYY-MM-DD'} onChange={changeDate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束烘烤时间">
                <DatePicker format={'YYYY-MM-DD'} onChange={changeDate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="days" label="烘烤天数">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sequence" label="炕次">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="part" label="部位">
                {/* <Input /> */}
                <Select>
                  <Option value="下二棚">下二棚</Option>
                  <Option value="上二棚">上二棚</Option>
                  <Option value="腰叶">腰叶</Option>
                  <Option value="顶叶">顶叶</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tool" label="夹烟工具">
                <Select>
                  <Option value="烟夹">烟夹</Option>
                  <Option value="烟杆">烟杆</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalPoleAmount" label="总竿数">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="samplePoleAmount" label="抽样杆数">
                <Input onBlur={calculate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="greenWeight" label="抽样青杂重量(kg)">
                <Input onBlur={calculate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sampleWeight" label="抽样黄烟重量(kg)">
                <Input onBlur={calculate} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalWeight" label="黄烟总黄烟重量(kg)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sampleTotalWeight" label="抽样黄烟重量(kg)">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="yellowRate" label="黄烟率(%)">
                <Input disabled />
              </Form.Item>
            </Col>{' '}
            <Col span={12}>
              <Form.Item name="updateReason" label="修改理由" rules={[{ required: true, message: '修改理由是必填项' }]}>

                {/* <Select>
                  <Option value='测产人员日期填报错误'>测产人员日期填报错误</Option>
                  <Option value='测产人员重量填报错误'>测产人员重量填报错误</Option>
                  <Option value='网络原因'>网络原因</Option>
                  <Option value='其他'>其他</Option>
                </Select> */}
                {isOtherSelected ? (
                  <Input
                    onBlur={handleInputBlur}
                  />
                ) : (
                  <Select onChange={handleSelectChange}>
                    <Option value='测产人员日期填报错误'>测产人员日期填报错误</Option>
                    <Option value='测产人员重量填报错误'>测产人员重量填报错误</Option>
                    <Option value='网络原因'>网络原因</Option>
                    <Option value='其他'>其他</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item name="imgs" label="Images" >
                <Input />
              </Form.Item>
            </Col> */}
            {/* <Col span={12}>
              <Form.Item name="farmerId" label="烟农">
                
                <Select
                  showSearch
                // filterOption={filterOptionFarmer}
                >
                  {farmerList.map(x => <Option value={x.id} key={x.id}>{x.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="collectorId" label="采集人">
              
                <Select showSearch>
                  {collectorList.map(x => <Option value={x.id} key={x.id}>{x.name}</Option>)}
                </Select>
              </Form.Item>
            </Col> */}
            {/* <Col span={12}>
              <Form.Item name="isMainFarmer" label="烤房绑定烟农" >
                <Select>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>

                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isMainCollector" label="烤房绑定填报人" >
                <Select>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>

                </Select>
              </Form.Item>
            </Col> */}
            {/* <Col span={12}>
              <Form.Item name="reviewId" label="Review ID" >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="submitflag" label="Submit Flag" >
                <Input />
              </Form.Item>
            </Col> */}
          </Row >

          <Form.Item style={{ textAlign: 'right' }}>
            {/* <Button type="primary" htmlType="cancel" >
              取消
            </Button> */}
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form >
      </Modal >
    </div >
  );
}
