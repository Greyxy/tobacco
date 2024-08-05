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
import moment from 'moment';
import { useEffect, useState } from 'react';
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
  startTime: '',
  endTime: '',
  farmerName: '',
  collectorName: '',
};
var originFarmerList = [];
var originCollectorList = [];
export default function index() {
  const { colorPrimary } = useThemeToken();
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
        </Space>
      ),
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
        return <span>{record?.farmer?.name || ''}</span>;
      },
    },
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
      title: '采集人',
      key: 'collect',
      render: (record) => {
        return <span>{record?.collector?.name || ''}</span>;
      },
    },
    {
      title: '采集人手机号',
      key: 'collect',
      render: (record) => {
        return <span>{record?.collector?.phoneNumber || ''}</span>;
      },
    },
    {
      title: '采集人身份证号',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.collector?.idNumber || ''}</span>;
      },
    },
    { title: '县城', dataIndex: 'county', key: 'county' },
    { title: '烟站名称', dataIndex: 'stationName', key: 'stationName' },
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
    { title: '填报时间', dataIndex: 'submitTime', key: 'submitTime' },
  ];

  columns.forEach((item) => (item.align = 'center'));
  const [editForm] = Form.useForm();

  const handleEdit = (record) => {
    let obj = JSON.parse(JSON.stringify(record));
    obj.startTime = moment(obj.startTime, 'YYYY-MM-DD');
    obj.endTime = moment(obj.endTime, 'YYYY-MM-DD');
    console.log(obj);
    setEditingRecord(obj);
    editForm.resetFields();
  };
  const onFinish = (values: any) => {
    // console.log('Form values:', values, queryObject);
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
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
  const handleTableChange = (pagination: any) => {
    getRoomData(queryObject, pagination.current, pagination.pageSize);
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
    };
    // obj.yellowWeight = 0;
    obj.sampleWeight = Number(obj.sampleWeight);
    obj.greenWeight = Number(obj.greenWeight);
    obj.sampleTotalWeight = obj.sampleWeight + obj.greenWeight;
    obj.totalWeight = (obj.sampleTotalWeight / 10) * obj.samplePoleAmount;
    obj.yellowRate = (obj.sampleWeight / obj.totalWeight).toFixed(2);
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
  const onChange = () => {
    console.log('onChange');
  };
  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        name="dynamic_form"
        onFinish={onFinish}
        initialValues={queryObject}
        layout="inline"
      >
        <Form.Item label="开始时间" name="startTime" style={{ marginTop: '5px' }}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime" style={{ marginTop: '5px' }}>
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
      </Form>

      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        key={key}
        className="mt-6 whitespace-nowrap"
        scroll={{ x: true }}
        onChange={handleTableChange}
        pagination={pagination}
      />
      {/* 修改表单 */}
      <Modal
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
              <Form.Item name="startTime" label="开始时间">
                <DatePicker format={'YYYY-MM-DD'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="endTime" label="结束时间">
                <DatePicker format={'YYYY-MM-DD'} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="days" label="烘烤天数">
                <Input />
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
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="greenWeight" label="青杂重量">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="sampleWeight" label="抽样重量">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="totalWeight" label="总重量">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sampleTotalWeight" label="抽样总重量">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="yellowRate" label="黄烟率">
                <Input />
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
          </Row>

          <Form.Item style={{ textAlign: 'right' }}>
            {/* <Button type="primary" htmlType="cancel" >
              取消
            </Button> */}
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
