import tobaccoService from '@/api/services/tobaccoService';

import { IconButton, Iconify } from '@/components/icon';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

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

export default function index() {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [queryObject, setQueryObject] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
  });
  const [title, setTitle] = useState('添加数据');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleFinish = (values) => {
    if (title == '添加数据') {
      tobaccoService.addCollector(values).then((res) => {
        if (res) {
          if (res) {
            messageApi.open({
              type: 'success',
              content: '添加成功',
            });
            setIsModalVisible(false);
          }
        }
      });
    } else {
      let obj = { ...values, id: editingRecord.id };
      tobaccoService.updateCollector(obj).then((res) => {
        if (res) {
          messageApi.open({
            type: 'success',
            content: '修改成功',
          });
          setIsModalVisible(false);
        }
      });
    }
  };

  useEffect(() => {
    if (!isModalVisible) {
      if (queryObject.idNumber || queryObject.phoneNumber || queryObject.name) {
        getCollectorByQuery(queryObject);
      } else {
        getCollectorList({ page: pagination.current, size: pagination.pageSize });
      }
    }
  }, [queryObject, pagination, isModalVisible]);
  const getCollectorList = (data) => {
    tobaccoService.getCollectorByQuery(data).then((res) => {
      if (res) {
        res.records.forEach((item, index) => {
          item.modifyTime = parseTime(item.modifyTime);
          item.createTime = parseTime(item.createTime);
        });
        if (res.total != pagination.total) {
          setPagination({
            ...pagination,
            total: res.total,
          });
        }
        setTableData(res.records);
      }
    });
  };
  const getCollectorByQuery = (data) => {
    tobaccoService.searchCollector(data).then((res) => {
      if (res) {
        res.forEach((item, index) => {
          item.modifyTime = parseTime(item.modifyTime);
          item.createTime = parseTime(item.createTime);
        });
        setTableData(res);
        if (pagination.total != 0) {
          setPagination({
            current: 1,
            pageSize: pagination.pageSize,
            total: 0,
          });
        }
      }
    });
  };

  const handleEdit = (record) => {
    // setIsModalVisible(true);
    form.setFieldsValue(record);
    setEditingRecord(record);
    setTitle('修改数据');
  };
  useEffect(() => {
    if (JSON.stringify(editingRecord) != '{}') {
      console.log(editingRecord);
      setIsModalVisible(true);
    }
  }, [editingRecord]);
  const handleDelete = (record) => {
    tobaccoService.deleteCollectorById(record.id).then((res) => {
      if (res) {
        message.open({
          type: 'success',
          content: '删除成功',
        });
        if (queryObject.idNumber || queryObject.phoneNumber || queryObject.name) {
          getCollectorByQuery(queryObject);
        } else {
          getCollectorList({ page: pagination.current, size: pagination.pageSize });
        }
      }
    });
  };

  const columns: ColumnsType<TableData> = [
    {
      title: '操作',
      key: 'action',
      fixed: 'left',
      render: (_, record) => (
        <Space size="middle">
          {/* <Button type="link" onClick={() => handleEdit(record)} style={{ color: colorPrimary }}>
            修改
          </Button> */}
          <IconButton onClick={() => handleEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title="删除采集人？"
            okText="Yes"
            cancelText="No"
            placement="left"
            onConfirm={() => handleDelete(record)}
          >
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </Space>
      ),
    },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: '身份证号', dataIndex: 'idNumber', key: 'idNumber' },
    { title: '地址', dataIndex: 'address', key: 'address' },

    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
  ];
  columns.forEach((item) => (item.align = 'center'));
  const onFinish = (values: any) => {
    setQueryObject({ ...queryObject, ...values });
  };
  const handleTableChange = (paginations: any) => {
    // 获取当前页数
    setPagination({ ...pagination, current: paginations.current, pageSize: paginations.pageSize });
  };
  const handleAdd = () => {
    setEditingRecord({
      name: '',
      idNumber: '',
      phoneNumber: '',
      address: '',
    });
    form.resetFields();
    setTitle('添加数据');
  };
  return (
    <>
      {contextHolder}
      <div className="flex items-center justify-between">
        <Form name="search_form" layout="inline" onFinish={onFinish} initialValues={queryObject}>
          <Form.Item name="name" label="姓名" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item name="phoneNumber" label="手机号码" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item name="idNumber" label="身份证号码" style={{ marginTop: '5px' }}>
            <Input allowClear={true} />
          </Form.Item>
          <Form.Item style={{ marginTop: '5px' }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={handleAdd}>
          新增
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="code"
        className="mt-6 whitespace-nowrap"
        scroll={{ x: true }}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={title}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered={true}
      >
        <Form initialValues={editingRecord} onFinish={handleFinish} form={form} layout="horizontal">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 29 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idNumber"
            label="身份证号码"
            rules={[{ required: true }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="手机号码"
            rules={[{ required: true }]}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="地址" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Input />
          </Form.Item>

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
