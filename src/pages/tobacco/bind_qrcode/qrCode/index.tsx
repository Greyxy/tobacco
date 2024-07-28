import tobaccoService, { TobaccoApi } from '@/api/services/tobaccoService';
import { Button, Col, Form, Modal, Row, Select, Space, Table, message, Tabs, QRCode } from 'antd';
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
var queryObject = {
  remark: ''
}
export default function QrCode() {
  const [bindForm] = Form.useForm();
  const [qrCodeData, setQrCodeData] = useState([]);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [roomIdList, setRoomIdList] = useState<string[]>([]);
  const [roomCodeList, setRoomCodeList] = useState<string[]>([]);
  const [remarkList, setRemarkList] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, any>>();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [key, setKey] = useState()
  const qrCodeColumns = [
    {
      title: '操作',
      key: 'action',
      fixed: 'left',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            绑定烤房
          </Button>
        </Space>
      ),
      align: 'center',
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '二维码备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
    },
    {
      title: '二维码',
      // dataIndex: 'content',
      key: 'content',
      align: 'center',
      render: (record) => {
        return <QRCode value={record.text} size={120} />
      }
    },
    {
      title: '重定向URL',
      dataIndex: 'redirectUrl',
      key: 'redirectUrl',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  useEffect(() => {
    getQrCodeData(queryObject, pagination.current, pagination.pageSize);
    getRoomData()
  }, []);
  const onQrcodeFinish = (values: any) => {
    const qrCode = qrCodeData.find((x) => x.remark === values.remark);
    if (qrCode) {
      tobaccoService.getQrCodeById(qrCode.id).then((res) => {
        setQrCodeData([res]);
      });
    } else {
      getQrCodeData(queryObject, pagination.current, pagination.pageSize)
    }
  };
  const getQrCodeData = (data, page, pageSize) => {
    tobaccoService.getQrCode({ ...data, page, pageSize }).then((res) => {
      setPagination({ ...pagination, current: page, pageSize, total: res.total })
      res = res.records
      setRemarkList(res.map((x) => x.remark));
      res.forEach(item => {
        item.modifyTime = parseTime(item.modifyTime)
        item.createTime = parseTime(item.createTime)
      })
      setQrCodeData(res);
    });
  };
  const handleTableChange = (pagination: any) => {
    getQrCodeData(queryObject, pagination.current, pagination.pageSize)
  }
  const downloadQrCode = async () => {
    if (!selectedRowKeys.length) {
      messageApi.open({
        type: 'error',
        content: '请勾选数据项'
      })
      return
    } else {
      let obj = {
        qrIds: selectedRowKeys.map(x => x + ''),
        // qrIds: ['123'],
        width: 300,
        height: 300
      }
      const token = JSON.parse(localStorage.getItem('token') || '{}').accessToken

      const response = await fetch('https://mgr.sctworks.com/service/img/getCode', {
        method: 'post',
        headers: {
          Token: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'image.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  const getRoomData = () => {
    tobaccoService.getRoomByArea({ currentPage: 1, pageSize: 999 }).then((res: TableData[]) => {
      res = res.records
      setTableData(res);
      setRoomIdList(res.map((x) => x.id));
      setRoomCodeList(res.map((x) => x.code));
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
  return (
    <div>
      {contextHolder}
      <div className='flex justify-between'>
        <Form name="search_qr_form" layout="inline" onFinish={onQrcodeFinish} initialValues={queryObject}>
          <Form.Item name="remark" label="备注">
            <Select placeholder="" style={{ width: 200 }} allowClear>
              {remarkList.map((x, index) => (
                <Option key={index} value={x}>
                  {x}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>

        <Button type="primary" onClick={() => downloadQrCode()}>
          下载二维码
        </Button>
      </div>
      <Table
        columns={qrCodeColumns}
        rowSelection={rowSelection}
        dataSource={qrCodeData}
        rowKey="id"
        className="mt-6 whitespace-nowrap"
        scroll={{ x: true }}
        onChange={handleTableChange}
        pagination={pagination}
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
        <Form initialValues={editingRecord} onFinish={handleFinish} form={bindForm} name='bind_form'>
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

  )
}