import tobaccoService from '@/api/services/tobaccoService';
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
  imgs: string;
  farmerId: string;
  collectorId: string;
  modifyTime: string;
  createTime: string;
}
function parseTime(data: string): string {
  const date = new Date(data);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export default function Oven() {
  const [bindForm] = Form.useForm();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [qrCodeData, setQrCodeData] = useState([]);
  const [roomIdList, setRoomIdList] = useState<string[]>([]);
  const [roomCodeList, setRoomCodeList] = useState<string[]>([]);
  const [remarkList, setRemarkList] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, any>>();
  const [messageApi, contextHolder] = message.useMessage();
  const columns: ColumnsType<TableData> = [
    {
      title: '操作',
      key: 'action',
      fixed: 'left',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            绑定二维码
          </Button>
        </Space>
      ),
      align: 'center',
    },
    {
      title: '烤房编码',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: '建设年份',
      dataIndex: 'buildYear',
      key: 'buildYear',
      align: 'center',
    },
    {
      title: '烤房类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '投入主体',
      dataIndex: 'mainInvestor',
      key: 'mainInvestor',
      align: 'center',
    },
    {
      title: '烟站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      align: 'center',
    },
    {
      title: '项目序号',
      dataIndex: 'sequence',
      key: 'sequence',
      align: 'center',
    },
    {
      title: '烤房性质',
      dataIndex: 'kind',
      key: 'kind',
      align: 'center',
    },
    {
      title: '烤房数量',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    },
  ];
  useEffect(() => {
    getRoomData();
    getQrCodeData();
  }, []);
  const onFinish = (values: any) => {
    if (values.smokeHouse) {
      tobaccoService.getRoomById(values.smokeHouse).then((res) => {
        setTableData([res]);
      });
    } else {
      getRoomData();
    }
  };
  const getRoomData = () => {
    tobaccoService.getRoomByArea().then((res: TableData[]) => {
      const formattedData = res.map((item) => ({
        ...item,
        modifyTime: parseTime(item.modifyTime),
        createTime: parseTime(item.createTime),
      }));
      setTableData(formattedData);
      setRoomIdList(formattedData.map((x) => x.id));
      setRoomCodeList(formattedData.map((x) => x.code));
    });
  };
  const handleOk = () => {
    setIsModalVisible(false);
    bindForm.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    bindForm.resetFields();
  };

  const handleFinish = (values: any) => {
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
        getRoomData();

        setIsModalVisible(false);
      });
    }
  };
  const handleEdit = (record: any) => {
    bindForm.resetFields();

    const obj = {
      roomCode: record.code,
      roomId: record.id || '',
      qrCodeId: '',
      remark: record.remark || '',
    };

    setIsModalVisible(true);
    setEditingRecord(obj);
  };
  const getQrCodeData = () => {
    tobaccoService.getQrCode().then((res) => {
      setRemarkList(res.map((x) => x.remark));
      setQrCodeData(res);
    });
  };
  return (
    <div className="">
      {contextHolder}
      <Form name="search_form" layout="inline" onFinish={onFinish}>
        <Form.Item name="smokeHouse" label="烟房">
          <Input />
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
        rowKey="code"
        className="mt-6 whitespace-nowrap"
        scroll={{ x: true }}
      />
      <Modal
        title="绑定数据"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
        afterClose={() => bindForm.resetFields()}
      >
        <Form
          initialValues={editingRecord}
          onFinish={handleFinish}
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
    </div>
  );
}
