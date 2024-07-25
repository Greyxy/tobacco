import tobaccoService, { TobaccoApi } from '@/api/services/tobaccoService';
import { Button, Col, Form, Modal, Row, Select, Space, Table, message, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
const { Option } = Select;
import Oven from './oven/index.tsx'
import QrCode from './qrCode/index.tsx'
const items = [
  {
    key: '1',
    label: '烤房',
    children: <Oven />
  },
  {
    key: '2',
    label: '二维码',
    children: <QrCode />
  },
]




export default function BindQrCode() {
  const [bindForm] = Form.useForm();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [qrCodeData, setQrCodeData] = useState([]);
  const [roomIdList, setRoomIdList] = useState<string[]>([]);
  const [roomCodeList, setRoomCodeList] = useState<string[]>([]);
  const [remarkList, setRemarkList] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, any>>();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  useEffect(() => {
    bindForm.setFieldsValue(editingRecord);
  }, [editingRecord, bindForm]);





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
        getQrCodeData();
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
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <>
      {contextHolder}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />


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

    </>
  );
}
