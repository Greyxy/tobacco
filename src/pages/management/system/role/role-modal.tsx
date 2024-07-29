import { Form, Modal, Input, InputNumber, Radio, Tree, Checkbox, Divider } from 'antd';
import { useEffect, useState } from 'react';

import { PERMISSION_LIST } from '@/_mock/assets';
import { flattenTrees } from '@/utils/tree';

import { Permission, Role } from '#/entity';
import { BasicStatus } from '#/enum';

import permissions from './permission.json'
export type RoleModalProps = {
  formValue: Role;
  title: string;
  show: boolean;
  onOk: VoidFunction;
  onCancel: VoidFunction;
};
const PERMISSIONS: Permission[] = PERMISSION_LIST;
export function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
  console.log(formValue)
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    setCheckedList(formValue.permissions)
    if (formValue.permission?.length == permissions.length) {
      setCheckAll(true)
    } else {
      setCheckAll(false)
    }
  }, [formValue])
  const onCheckAllChange = (e) => {
    const checked = e.target.checked;
    setCheckedList(checked ? permissions.map(item => item.id) : []);
    setCheckAll(checked);
    form.setFieldsValue({
      permissions: checked ? permissions.map(item => item.id) : []
    });
  };

  const onChange = (list) => {
    setCheckedList(list);
    setCheckAll(list.length === permissions.length);
  };

  const flattenedPermissions = flattenTrees(formValue.permission);
  const checkedKeys = flattenedPermissions.map((item) => item.id);
  useEffect(() => {
    form.setFieldsValue({ ...formValue });
  }, [formValue, form]);

  return (
    <Modal title={title} open={show} onOk={() => onOk(form, checkedList, title)} onCancel={onCancel} width={400}>
      <Form
        initialValues={formValue}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
      >
        <Form.Item<Role> label="角色名" name="roleName" required>
          <Input />
        </Form.Item>
        <Form.Item>
          <Checkbox
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        </Form.Item>
        <Form.Item name="permissions">
          <Checkbox.Group
            options={permissions.map(item => ({ label: `${item.remark} (${item.name})`, value: item.id }))}
            value={checkedList}
            onChange={onChange}
          />
        </Form.Item>
        {/* <Form.Item<Role> label="权限" name="permission">
          <Checkbox.Group
            options={permissions.map(item => ({ label: `${item.remark} (${item.name})`, value: item.name }))}
            value={checkedList}
            onChange={onChange}
          />
        </Form.Item> */}
      </Form>
    </Modal>
  );
}
