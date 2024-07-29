import { Button, Card, Form, Input, message, Modal, Popconfirm, Radio, Select } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';

import tobaccoService from '@/api/services/tobaccoService';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';
import { useThemeToken } from '@/theme/hooks';

import type { UserInfo } from '#/entity';
import { useEffect, useState } from 'react';
const { Option } = Select;
export default function RolePage() {
  const [form] = Form.useForm();
  const { colorTextSecondary } = useThemeToken();

  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [title, setTitle] = useState('添加用户');
  const [cityList, setCityList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userForm, setUserForm] = useState({
    userId: '',
    userName: '',
    password: '',
    nickName: '',
    phone: '',
    email: '',
    status: '',
    cityName: '',
    roleId: '',
  });

  useEffect(() => {
    getUserList();
    getRoleList();
    getCityList();
  }, []);
  useEffect(() => {
    if (isModalVisible) {
      form.setFieldsValue(userForm);
    }
  }, [userForm, isModalVisible]);
  const getUserList = () => {
    tobaccoService.getAllUser().then((res) => {
      if (res?.records) {
        setTableData(res.records);
      }
    });
  };
  const getRoleList = () => {
    tobaccoService.getAllRole().then((res) => {
      if (res.records) setRoleList(res.records);
    });
  };
  const getCityList = () => {
    tobaccoService.getCountry().then((res) => {
      if (res) setCityList(res);
    });
  };
  const onEdit = (record) => {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user.username == record.userName) {
      message.open({
        type: 'warning',
        content: '不允许修改本人账号',
      });
      return;
    }
    setTitle('编辑用户');
    form.resetFields();
    setUserForm(record);
    setIsModalVisible(true);
  };

  const onDelete = (record) => {
    tobaccoService.deleteUserById(record.userId).then((res) => {
      message.open({
        type: 'success',
        content: '删除用户成功',
      });
      getUserList();
    });
  };

  const columns: ColumnsType<UserInfo> = [
    {
      title: '姓名',
      dataIndex: 'name',
      width: 180,
      render: (_, record) => {
        return (
          <div className="flex">
            <div className="ml-2 flex flex-col">
              <span className="text-sm">{record.userName}</span>
              <span style={{ color: colorTextSecondary }} className="text-xs">
                {record.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      align: 'center',
      width: 120,
    },
    {
      title: '别名',
      dataIndex: 'nickName',
      align: 'center',
      width: 120,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
      width: 120,
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      align: 'center',
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => (
        <ProTag color={status == 0 ? 'error' : 'success'}>{status == 0 ? '禁用' : '正常'}</ProTag>
      ),
    },
    {
      title: 'Action',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <div className="flex w-full justify-center text-gray">
          <IconButton onClick={() => onEdit(record)}>
            <Iconify icon="solar:pen-bold-duotone" size={18} />
          </IconButton>
          <Popconfirm
            title="删除用户？"
            okText="Yes"
            cancelText="No"
            placement="left"
            onConfirm={() => onDelete(record)}
          >
            <IconButton>
              <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
            </IconButton>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onAddUser = () => {
    setTitle('添加用户');
    form.resetFields();
    setUserForm({
      userId: '',
      userName: '',
      password: '',
      nickName: '',
      phone: '',
      email: '',
      status: '',
      cityName: '',
      roleId: '',
    });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const onFinish = (values) => {
    console.log('Form values:', values);
    let obi = { ...values };
    // obj.roleId= values.
    // Add or update user logic here
    if (title == '添加用户') {
      values.roleName = '管理员';
      tobaccoService.createUser(values).then((res) => {
        message.open({
          type: 'success',
          content: '添加用户成功',
        });
        getUserList();
        setIsModalVisible(false);
        form.resetFields();
      });
    } else {
      let obj = { ...values, userId: userForm.userId };
      tobaccoService.updateUser(obj).then((res) => {
        message.open({
          type: 'success',
          content: '修改用户成功',
        });
        getUserList();
        setIsModalVisible(false);
        form.resetFields();
      });
    }
  };
  const onSearchHanle = (values) => {
    if (values.userName) {
      tobaccoService.findUser(values.userName).then((res) => {
        setTableData(res);
      });
    } else {
      getUserList();
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };
  return (
    <>
      {contextHolder}
      <Form layout="inline" onFinish={onSearchHanle} name="searchForm">
        <Form.Item name="userName" label="用户名">
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
      </Form>
      <Card
        title="用户列表"
        extra={
          <Button type="primary" onClick={onAddUser}>
            新增
          </Button>
        }
        // className="mt-0.5"
        style={{ marginTop: '2px' }}
      >
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          pagination={false}
          columns={columns}
          dataSource={tableData}
        />
      </Card>
      <Modal
        title={title}
        open={isModalVisible}
        footer={null}
        afterClose={() => form.resetFields()}
        centered={true}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        {isModalVisible && (
          <Form
            form={form}
            name="userForm"
            layout="vertical"
            onFinish={onFinish}
            initialValues={userForm}
          >
            <Form.Item
              name="userName"
              label="用户名"
              rules={[{ required: true, message: 'Please input your user name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="roleId" label="角色">
              {/* <Input /> */}
              <Select>
                {roleList.map((x) => {
                  return (
                    <Option value={x.id} key={x.id}>
                      {x.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item name="nickName" label="别名">
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="手机号">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="邮箱">
              <Input />
            </Form.Item>
            <Form.Item name="status" label="状态">
              <Radio.Group>
                <Radio value={'0'}>停用</Radio>
                <Radio value={'1'}>正常</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="cityName" label="城市名">
              {/* <Input /> */}
              <Select>
                {cityList.map((x) => {
                  return (
                    <Option value={x} key={x}>
                      {x}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
