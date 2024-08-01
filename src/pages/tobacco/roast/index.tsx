import tobaccoService from '@/api/services/tobaccoService';
import AsyncImage from '@/pages/components/asyncImage';
import { Button, DatePicker, Form, Input, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

const { Option } = Select;
interface TableData {
  id: string;
  roomId: string;
  startTime: string; // datetime
  endTime: string; // datetime
  days: number;
  sequence: number;
  part: string;
  tool: string;
  totalPoleAmount: number;
  totalWeight: number;
  samplePoleAmount: number;
  sampleWeight: number;
  greenWeight: number;
  sampleTotalWeight: number;
  yellowRate: number;
  longitude: number;
  latitude: number;
  imgs: string;
  isMainFarmer: number;
  farmerId: string;
  isMainCollector: number;
  collectorId: string;
  submitTime: string; // datetime
  // modifyTime: string; // datetime
  // createTime: string; // datetime
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
  // roomId: "",
  startTime: '',
  endTime: '',
  farmerName: '',
  collectorName: '',
};
export default function index() {
  const columns: ColumnsType<TableData> = [
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
      title: '烟农号码',
      // dataIndex: 'farmer.farmerName',
      key: 'farmer',
      render: (record) => {
        return <span>{record?.farmer?.phoneNumber || ''}</span>;
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
      title: '采集人号码',
      key: 'collect',
      render: (record) => {
        return <span>{record?.collector?.phoneNumber || ''}</span>;
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
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // console.log('Form values:', values, queryObject);
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD') : null,
    };
    queryObject = formattedValues;
    getRoomData(formattedValues, pagination.current, pagination.pageSize);
  };
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [roomIdList, setRoomIdList] = useState<String[]>([]);
  const [farmerIdList, setFarmerIdList] = useState([]);
  const [collectorIdList, setCollectIdList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [key, setKey] = useState();
  const [cityList, setCityList] = useState([]);
  const [stationList, setStationList] = useState([]);
  useEffect(() => {
    getRoomData(queryObject, pagination.current, pagination.pageSize);
    getCityList();
  }, []);
  useEffect(() => {
    console.log('我执行力');
    console.log(tableData);
  }, [tableData]);
  const getRoomData = (data: any, page: number, pageSize: number) => {
    tobaccoService.backingQuery({ ...data, currentPage: page, pageSize }).then((res) => {
      setPagination({ ...pagination, current: page, pageSize, total: res.total });
      res = res.records;
      let currentIndex = 0;
      res.forEach(async (item: TableData, index) => {
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
      setRoomIdList(res.map((x: TableData) => x.roomId));
      setFarmerIdList(res.map((x: TableData) => x.farmerId));
      setCollectIdList(res.map((x: TableData) => x.collectorId));
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
    tobaccoService.getStation({ county: value }).then((res) => {
      setStationList(res);
    });
  };

  return (
    <div>
      <Form
        form={form}
        name="dynamic_form"
        onFinish={onFinish}
        initialValues={queryObject}
        layout="inline"
      >
        <Form.Item label="开始时间" name="startTime">
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="结束时间" name="endTime">
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="烟农" name="farmerName">
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item label="采集人" name="collectorName">
          <Input allowClear={true} />
        </Form.Item>
        <Form.Item label="县城" name="county">
          <Select style={{ width: 200 }} onChange={changeCountry}>
            {cityList.map((x) => (
              <Option key={x} value={x}>
                {x}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="烟站名称" name="stationName">
          {/* <Input allowClear={true} /> */}
          <Select style={{ width: 200 }}>
            {stationList.map((x) => (
              <Option key={x} value={x}>
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
    </div>
  );
}
