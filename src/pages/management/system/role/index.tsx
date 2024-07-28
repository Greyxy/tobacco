import { Button, Card, message, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import { ROLE_LIST } from '@/_mock/assets';
import { IconButton, Iconify } from '@/components/icon';
import ProTag from '@/theme/antd/components/tag';

import { RoleModal, RoleModalProps } from './role-modal';

import { Role } from '#/entity';
import { BasicStatus } from '#/enum';
import tobaccoService from '@/api/services/tobaccoService';

const ROLES: Role[] = ROLE_LIST;

const DEFAULE_ROLE_VALUE = {
  id: '',
  roleName: '',
  // label: '',
  // status: BasicStatus.ENABLE,
  permissionIds: [],
};
export default function RolePage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [tableData, setTableData] = useState([])
  useEffect(() => {
    getRoleList()
  }, [])
  const [roleModalPros, setRoleModalProps] = useState<RoleModalProps>({
    formValue: { ...DEFAULE_ROLE_VALUE },
    title: '新增角色',
    show: false,
    onOk: (formValue, checkedList, title) => {
      // console.log(formValue.getFieldValue('name'),checkedList)
      if (title.includes('新增')) {

        tobaccoService.addRole({
          roleName: formValue.getFieldValue('roleName'),
          permissionIds: checkedList.join(',')
        }).then(res => {
          messageApi.open({
            type: 'success',
            content: '添加角色成功',
          });
          getRoleList()
          setRoleModalProps((prev) => ({ ...prev, show: false, formValue: { ...DEFAULE_ROLE_VALUE } }));
        })
      } else {
        tobaccoService.updateRole({
          id: formValue.getFieldValue('id'),
          name: formValue.getFieldValue('roleName'),
          permissionIds: checkedList
        }).then(res => {
          messageApi.open({
            type: 'success',
            content: '修改角色成功',
          });
          getRoleList()
          setRoleModalProps((prev) => ({ ...prev, show: false, formValue: { ...DEFAULE_ROLE_VALUE } }));
        })
      }
    },
    onCancel: () => {
      setRoleModalProps((prev) => ({ ...prev, show: false, }));
    },
  });
  const columns: ColumnsType<Role> = [
    {
      title: '角色名',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '操作',
      key: 'operation',
      align: 'center',
      width: 100,
      render: (a, record) => {
        console.log(a, record)
        return (

          < div className="flex w-full justify-center text-gray" >
            <IconButton onClick={() => onEdit(record)}>
              <Iconify icon="solar:pen-bold-duotone" size={18} />
            </IconButton>
            <Popconfirm title="删除角色" okText="Yes" cancelText="No" placement="left" onClick={() => onDelete(record)}>
              <IconButton>
                <Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
              </IconButton>
            </Popconfirm>
          </div >
        )
      },
    },
  ];
  const getRoleList = () => {
    tobaccoService.getAllRole().then(res => {
      console.log(res)
      res.records.forEach(item => item.id += '')
      console.log(res.records)
      setTableData(res.records)
    })
  }
  const onCreate = () => {
    setRoleModalProps((prev) => ({
      ...prev,
      show: true,
      title: '新增角色',
      formValue: {
        ...prev.formValue,
        ...DEFAULE_ROLE_VALUE,
      },
    }));
  };

  const onEdit = (record) => {
    // 先获取权限
    tobaccoService.getRolePermission(record.id).then(res => {

      setRoleModalProps((prev) => ({
        ...prev,
        show: true,
        title: '修改角色',
        formValue: { ...record, roleName: record.name, permissions: [...res.map(x => x.id)] },
      }));
    })
  };
  const onDelete = (formValue) => {
    tobaccoService.deleteRole(formValue.id).then(res => {
      messageApi.open({
        type: 'success',
        content: '删除角色成功'
      })
      getRoleList()
    })
  }

  return (
    <>
      {contextHolder}
      <Card
        title="角色列表"
        extra={
          <Button type="primary" onClick={onCreate}>
            新增
          </Button>
        }
      >
        <Table
          rowKey="id"
          size="small"
          scroll={{ x: 'max-content' }}
          pagination={false}
          columns={columns}
          dataSource={tableData}
        />

        <RoleModal {...roleModalPros} />
      </Card>
    </>
  );
}
