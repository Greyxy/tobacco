import tobaccoService from '@/api/services/tobaccoService';
import AsyncImage from '@/pages/components/asyncImage';
import { useThemeToken } from '@/theme/hooks';
import { Button, Col, Form, Input, message, Modal, Row, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
const { Option } = Select;
interface TableData {
  id: string;
  code: string;
  buildYear: string;
  regionCode: string;
  type: string;
  mainInvestor: string;
  stationName: string;
  sequence: string;
  kind: string;
  amount: number;
  size: string;
  isIntact: number;
  usageRight: string;
  deviceFactory: string;
  deviceType: string;
  isDeviceReplaced: number;
  replaceYear: string;
  longitude: string;
  latitude: string;
  imgs: string | string[];
  farmerId: string;
  collectorId: string;
  modifyTime: string;
  createTime: string;
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
  return formattedDate;
}
var queryObject = {
  roomCode: '',
  farmerName: '',
  collectorName: '',
  stationName: '',
};
export default function index() {
  const [bindForm] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [roomIdList, setRoomIdList] = useState<String[]>([]);
  const [roomCodeList, setRoomCodeList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalBindVisible, setIsModalBindVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState([]);
  const [remarkList, setRemarkList] = useState<string[]>([]);
  const [farmerList, setFarmerList] = useState([]);
  const [collectorList, setCollectorList] = useState([]);
  const [key, setKey] = useState();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  const [cityList, setCityList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [editForm] = Form.useForm();
  const getCityList = () => {
    tobaccoService.getCountry().then((res) => {
      if (res) setCityList(res);
    });
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleBindOk = () => {
    setIsModalBindVisible(false);
    bindForm.resetFields();
  };

  const handleBindCancel = () => {
    setIsModalBindVisible(false);
    bindForm.resetFields();
  };
  const handleFinish = (values) => {
    let index = tableData.findIndex((x) => x.code == values.code);
    if (index != -1) {
      values.id = tableData[index].id;
    }
    console.log(values, index);
    let obj = { ...values, id: editingRecord.id };
    tobaccoService.updateRoom(obj).then((res) => {
      if (res) {
        messageApi.open({
          type: 'success',
          content: '修改成功',
        });
        getRoomData(queryObject, pagination.current, pagination.pageSize);
        setIsModalVisible(false);
      }
    });
  };
  const handleBindFinish = (values: any) => {
    const { roomCode, remark } = values;
    if (!roomCode || !remark) {
      messageApi.open({
        type: 'error',
        content: '请选择房间和二维码',
      });
      return;
    }

    const room = tableData.find((x) => x.code === roomCode);
    const qrCode = qrCodeData.find((x) => x.remark === remark);

    if (room && qrCode) {
      const obj = {
        roomCode: room.code,
        roomId: room.id,
        qrCodeId: qrCode.id,
      };
      tobaccoService.saveRoomCode(obj).then(() => {
        messageApi.open({
          type: 'success',
          content: '绑定成功',
        });
        bindForm.resetFields();
        getRoomData(queryObject, pagination.current, pagination.pageSize);

        setIsModalBindVisible(false);
      });
    }
  };
  useEffect(() => {
    getRoomData(queryObject, pagination.current, pagination.pageSize);
    getQrCodeData();
    getFarmerList();
    getCollectorList();
    getCityList();
  }, []);
  const getRoomData = (data, current, pageSize) => {
    tobaccoService.getRoomByArea({ ...data, currentPage: current, pageSize }).then((res) => {
      setPagination({ ...pagination, current, pageSize, total: res.total });
      let currentIndex = 0;
      res = res.records || [];
      res.forEach(async (item: TableData, index) => {
        // item.modifyTime = parseTime(item.modifyTime)
        // item.createTime = parseTime(item.createTime)
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
          clearInterval(timer);
          setTableData(res);
          console.log(res);
          setKey(new Date().getTime());
        }
      }, 100);
      setKey(new Date().getTime());
      setTableData(res);
      setRoomCodeList(res.map((x: TableData) => x.code));
    });
  };
  // 获取受益人列表和采集人列表
  const getFarmerList = () => {
    tobaccoService.getFarmerByQuery({ page: 1, size: 1000 }).then((res) => {
      setFarmerList(res.records || []);
    });
  };
  const getCollectorList = () => {
    tobaccoService.getCollectorByQuery({ page: 1, size: 1000 }).then((res) => {
      setCollectorList(res.records || []);
    });
  };
  const { colorPrimary } = useThemeToken();
  const handleEdit = (record) => {
    record.collectorId = record.collectorId + '';
    record.farmerId = record.farmerId + '';
    record.id = record.id;
    setEditingRecord(record);
    editForm.resetFields();
  };
  useEffect(() => {
    if (editingRecord && editingRecord.id) {
      console.log(editingRecord);
      editForm.setFieldsValue(editingRecord);
      setIsModalVisible(true);
    }
  }, [editingRecord]);
  const columns: ColumnsType<TableData> = [
    {
      title: '操作',
      key: 'action',
      fixed: 'left',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)} style={{ color: colorPrimary }}>
            修改
          </Button>
          {/* <Button type="link" onClick={() => handleBindQrCode(record)} >
            绑定二维码
          </Button> */}
        </Space>
      ),
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '烤房编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '建设年份',
      dataIndex: 'buildYear',
      key: 'buildYear',
    },
    {
      title: '行政区划代码',
      dataIndex: 'regionCode',
      key: 'regionCode',
    },
    {
      title: '烤房类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '投入主体',
      dataIndex: 'mainInvestor',
      key: 'mainInvestor',
    },
    {
      title: '县公司',
      dataIndex: 'cityName',
      key: 'cityName',
    },
    {
      title: '烟站名称',
      dataIndex: 'stationName',
      key: 'stationName',
    },
    {
      title: '项目序号',
      dataIndex: 'sequence',
      key: 'sequence',
    },
    {
      title: '烤房性质',
      dataIndex: 'kind',
      key: 'kind',
    },
    {
      title: '烤房数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '烤房规格',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '是否完好',
      // dataIndex: 'isIntact',
      key: 'isIntact',
      render: (record: any) => {
        return record.isIntact == 1 ? <span>是</span> : <span>否</span>;
      },
    },
    {
      title: '烤房使用权属',
      dataIndex: 'usageRight',
      key: 'usageRight',
    },
    {
      title: '烟农',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.farmer?.name + '-' + record?.farmer?.phoneNumber || ''}</span>;
      },
    },
    // {
    //   title: '烟农手机号',
    //   // dataIndex: 'farmer.farmerName',
    //   key: 'farmer',
    //   render: (record) => {
    //     return <span>{record?.farmer?.phoneNumber || ''}</span>;
    //   },
    // },
    {
      title: '采集人',
      key: 'collect',
      render: (record) => {
        return <span>{record?.collector?.name + '-' + record?.collector?.phoneNumber || ''}</span>;
      },
    },
    // {
    //   title: '采集人手机号',
    //   key: 'collect',
    //   render: (record) => {
    //     return <span>{record?.collector?.phoneNumber || ''}</span>;
    //   },
    // },
    {
      title: '设备厂家',
      dataIndex: 'deviceFactory',
      key: 'deviceFactory',
    },
    {
      title: '设备类型',
      dataIndex: 'deviceType',
      key: 'deviceType',
    },
    {
      title: '是否替换设备',
      dataIndex: 'isDeviceReplaced',
      key: 'isDeviceReplaced',
      render: (record) => {
        return record.isDeviceReplaced == 1 ? <span>是</span> : <span>否</span>;
      },
    },
    {
      title: '更换年份',
      dataIndex: 'replaceYear',
      key: 'replaceYear',
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
    },
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
  ];
  columns.forEach((item) => (item.align = 'center'));
  const onFinish = (values: any) => {
    getRoomData(values, 1, pagination.pageSize);
    queryObject = values;
    setPagination({ ...pagination, current: 1 });
  };
  const getQrCodeData = () => {
    tobaccoService.getQrCode().then((res) => {
      setRemarkList(res.records.map((x) => x.remark));
      setQrCodeData(res);
    });
  };
  const handleTableChange = (pagination, filters, sorter) => {
    // 获取当前页数
    const { current, pageSize } = pagination;
    console.log('Current Page:', current);
    getRoomData(queryObject, current, pageSize);
  };
  const handleFilter = (input, option) => {
    return option.children.includes(input);
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
  return (
    <>
      {contextHolder}
      <Form name="search_form" layout="inline" onFinish={onFinish} initialValues={queryObject}>
        <Form.Item name="roomCode" label="烤房编码" style={{ marginTop: '5px' }}>
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item name="farmerName" label="烟农姓名" style={{ marginTop: '5px' }}>
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item name="farmerPhone" label="烟农手机号" style={{ marginTop: '5px' }}>
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item name="collectorName" label="采集人姓名" style={{ marginTop: '5px' }}>
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item name="collectorPhone" label="采集人手机号" style={{ marginTop: '5px' }}>
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
        {/* <Form.Item name="stationName" label="站点名称" style={{ marginTop: '5px' }}>
          <Input allowClear={true} />
        </Form.Item> */}
        <Form.Item style={{ marginTop: '5px' }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        key={key}
        dataSource={tableData}
        rowKey="code"
        className="mt-6 whitespace-nowrap"
        scroll={{ x: true }}
        pagination={pagination}
        onChange={handleTableChange}
      />

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
              <Form.Item name="kind" label="烤房性质">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="amount" label="烤房数量">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="size" label="烤房规格">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="isIntact" label="是否完好">
                <Select>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usageRight" label="烤房使用权属">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="deviceFactory" label="设备厂家">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deviceType" label="设备类型">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="isDeviceReplaced" label="是否替换设备">
                {/* <Input /> */}
                <Select>
                  <Option value={0}>否</Option>
                  <Option value={1}>是</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="replaceYear" label="更换年份">
                <Input />
              </Form.Item>
            </Col>

            {/* <Col span={12}>
                <Form.Item name="imgs" label="图片">
                  <Input />
                </Form.Item>
              </Col> */}
            <Col span={12}>
              <Form.Item name="farmerId" label="烟农">
                {/* <Input /> */}
                <Select showSearch={true} allowClear={true} filterOption={handleFilter}>
                  {farmerList.map((x) => (
                    <Option value={x.id} key={x.id}>
                      {x.name + '-' + x.phoneNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="collectorId" label="采集人">
                {/* <Input /> */}
                <Select showSearch={true} allowClear={true} filterOption={handleFilter}>
                  {collectorList.map((x) => (
                    <Option value={x.id} key={x.id}>
                      {x.name + '-' + x.phoneNumber}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="modifyTime" label="修改时间">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="createTime" label="创建时间">
                  <Input />
                </Form.Item>
              </Col>
            </Row> */}

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
      <Modal
        title="绑定二维码"
        open={isModalBindVisible}
        onOk={handleBindOk}
        onCancel={handleBindCancel}
        footer={null}
        width={600}
        centered
        afterClose={() => bindForm.resetFields()}
      >
        <Form
          initialValues={editingRecord}
          onFinish={handleBindFinish}
          form={bindForm}
          name="bind_form"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="roomCode" label="烤房编码">
                <Select>
                  {roomCodeList.map((x, index) => (
                    <Option key={index} value={x}>
                      {x}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="remark" label="二维码备注">
                <Select>
                  {remarkList.map((x, index) => (
                    <Option key={index} value={x}>
                      {x}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
