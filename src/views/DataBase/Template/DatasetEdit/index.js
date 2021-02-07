import React, { Component } from 'react'
import { getDatasetDetail, postDatasetOpertors, postDatasetTransColumnData, postDatasetSelfCycleBuild, postDatasetEditPreview } from '@src/views/api/Darabase.api'
import { Select, Checkbox, Button, Input, Popover } from 'antd'
import { IconSvg } from '@src/components/iconFont'
import DefinedTable from '@src/components/table/DefinedTable'
import styled from 'styled-components'


const HeaderBox = styled.div`
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px 0px 8px 0px rgba(44, 64, 95, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 0 25px;
  z-index: 10;
  position: relative;
`
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`
const StepBox = styled.div`
  height: 60px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  box-shadow: 0px 0px 8px 0px rgba(44, 64, 95, 0.3);
`
const StepItemBox = styled.div`
  display: flex;
  align-items: center;
`
const StepItemLine = styled.div`
  border-top: 1px solid rgba(155, 155, 155, 0.5);
  width: 80px;
  position: relative;
`
const StepItemBt = styled.div`
  width: 160px;
  height: 30px;
  background: #F0F5FF;;
  border-radius: 15px;
  border: 1px solid #597EF7;
  margin: 0 10px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;
`
const StepAddBt = styled.div`
  width: 160px;
  height: 30px;
  line-height: 28px;
  background: #597EF7;
  border-radius: 15px;
  border: 1px solid #597EF7;
  margin: 0 10px;
  cursor: pointer;
  text-align: center
`
const ContentABox = styled.div` // 左右结构的内容布局
  display: flex;
  padding: 10px;
  flex: 1;
`
const ContentBoxLeft = styled.div` // 左右结构的左边
  min-width: 280px;
  background: #ffffff;
  height: 100%;
  padding: 0 16px;
`
const ContentBoxRight = styled.div` // 左右结构的右边
  flex: 1;
  margin-left: 10px;
  background: #ffffff;
`
const ContentTBox = styled.div` // 上下结构的内容布局
  font-size: 13px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  flex: 1;
`
const ContentBoxUp = styled.div` // 上下结构的上部
  height: 276px;
  background: #ffffff;
  padding: 10px;
`
const ContentBoxDown = styled.div` // 上下结构的下部
  background: #ffffff;
  margin-top: 10px;
  flex: 1;
`
const SwitchMatrixHead = styled.div`
  padding: 10px 0;
`
const SwitchMatrixBody = styled.div`
  display: flex;
  height: 210px;
`
const SwitchMatrixBodyItemBox = styled.div`
  min-width: 280px;
  height: 100%;
  border-right: 1px solid rgba(216, 216, 216, 1);
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  &:last-child {
    flex: 1;
    border-right: none;
  }
  &:first-child {
    padding-left: 0;
  }
`
const SwitchMatrixBodyItemTitle = styled.div`
  font-weight: 600;
  color: #333333;
  height: 30px;
  line-height: 30px;
`
const SwitchMatrixBodyItemContent = styled.div`
  flex: 1;
  overflow-y: auto;
`
const CriculationHeaderBox = styled.div`
  display: flex;
`
const CriculationHeaderLeft = styled.div`
  min-width: 302px;
  border: 1px solid #D8D8D8;
  padding: 0 10px;
`
const CriculationItem = styled.div`
  margin-top: 10px;
`
const CriculationLabel = styled.span`
  width: 84px;
  color: #666666;
  font-size: 12px;
  display: inline-block;
`
const CriculationHeaderRight = styled.div`
  width: 600px;
  height: 100%;
  border: 1px solid #D8D8D8;
  margin-left: 10px;
  padding: 10px;
`
const CriculationDefinesSelectBox = styled.div`
  display: flex;
  height: 300px;
  flex-direction: column;
  overflow-y: hidden;
`
const CriculationDefinesSelectContent = styled.div`
  flex: 1;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`
const PreviewHeadBox = styled.div`
  height: 40px;
  padding: 0 10px 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const PreviewHint = styled.span`
  font-size: 12px;
  color: #9ea6b2;
  padding-right: 10px;
`



class DatasetEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableName: null, // 表名
      selFields: [], // 选中的项
      indeterminate: false, // 全选框的样式
      checkAll: false, // 是否全选
      currentStep: 'selFields', // 当前步骤 selFields => 选字段, transferType => 类型转换, switchMatrix => 行列转换, circulation => 自循环, add => 加号
      stepData: [], // 各步骤的数据 stepData: [{preFields: {}, fields: {}, type: },{preFields: {}, fields: {}}]
      invalidOperatorDtoList: [], // operator 接口返回的数据
      addBtVisiable: true, // 添加按钮是否显示
      transferTypeVisiable: true, // 字段类型转换 选项是否显示
      previewHintVisiable: false, // 数据预览提示文字是否显示

      previewData: null, // 数据预览
      matrixColumnData: [], // 行列转换 - 转换列数据
      matrixIndeterminate: false, // 行列转换 - 选择栏次名 - 全选框样式
      matrixSelColumnData: [], // 行列转换 - 选择栏次名 - 选中项
      matrixCheckAll: false, // 行列转换-选择栏次名 - 是否全选
      matrixOriginFields: [], // 行列转换 - 原始指标字段数据
      matrixSelOriginFields: [], // 行列转换 - 选中的原始指标字段数据
      matrixNewFields: [], // 行列转换 - 生成的指标字段, {newName: '', oldName: '', id: ''}

      matrixCirulationCheckAll: false, // 行列转换 - 自循环 - 分层结果 - 全选
      matrixCirulationIndeterminate: false, // 行列转换 - 自循环 - 分层结果 - 全选框样式
      matrixCirulationSelData: [], // 行列转换 - 自循环 - 分层结果 - 选中项
      matrixCirulationIdFields: null // 分类数据的 ID 列
    }
  }

  componentDidMount () {
    window.addEventListener('click', (e) => {
      e.stopPropagation()
    })
    const { params } = this.props
    const { stepData } = this.state
    let stepDataItem = {}
    let selFields = []
    let indeterminate = false
    let checkAll = false
    // getDatasetDetail(params.tableId).then(res => {
    getDatasetDetail(114200743645186).then(res => {
      stepDataItem.preFields = res.data.data.fields
      stepDataItem.type = 'BASE_SELECT'
      stepDataItem.fields = []

      for (let item of res.data.data.fields) {
        if (item.usable) {
          selFields.push(item.name)
        }
      }
      if (selFields.length == res.data.data.fields.length) {
        checkAll = true
      } else if (0 < selFields.length) {
        indeterminate = true
      } else {
        checkAll = false
      }
      stepData.push(stepDataItem)
      this.setState({
        tableName: res.data.data.transferName,
        stepData: stepData,
        selFields: selFields,
        indeterminate: indeterminate,
        checkAll: checkAll
      })
    })
  }

  postOpertors = () => {
    const { params } = this.props
    const { stepData } = this.state
    postDatasetOpertors({
      // id: params.tableId,
      id: 114200743645186,
      operators: stepData
    }).then(res => {
      this.setState({
        invalidOperatorDtoList: res.data.data.invalidOperatorDtoList
      })
      console.log('opertors------------', res.data.data.invalidOperatorDtoList)
    })
  }

  preview = (operatorIndex) => { // 数据预览
    const { params } = this.props
    const { stepData, invalidOperatorDtoList } = this.state
    // postDatasetEditPreview (params.tableId, operatorIndex, stepData).then(res => {
    postDatasetEditPreview(114200743645186, operatorIndex, stepData).then(res => {

      const tableData = {}
      tableData.headerData = res.data.data.fields
      tableData.columnData = res.data.data.data
      console.log('数据预览', tableData)
      this.setState({
        previewData: tableData
      }, () => { console.log('数据预览', this.state) })
    })
  }

  SelFieldTem = (data) => { // 选字段模板
    const { selFields, indeterminate, checkAll, stepData, previewData, invalidOperatorDtoList, previewHintVisiable } = this.state
    const { params } = this.props
    const fields = []
    const onChange = list => {
      for (let item of list) {
        let itemCopy = JSON.parse(JSON.stringify(stepData[0].preFields.find(items => items.name == item)))
        itemCopy.usable = true
        fields.push(itemCopy)
      }
      stepData[0].fields = fields
      this.setState({
        stepData: stepData,
        selFields: list,
        indeterminate: !!list.length && list.length < stepData['0'].preFields.length,
        checkAll: list.length === stepData['0'].preFields.length
      }, () => {
        this.postOpertors()
      })
    }

    const onCheckAllChange = e => {
      if (e.target.checked) {
        let preFieldsCopy = JSON.parse(JSON.stringify(stepData[0].preFields))
        stepData[0].fields = preFieldsCopy.map(item => {
          item.usable = true
          return item
        })
      } else {
        stepData[0].fields = []
      }
      this.setState({
        selFields: e.target.checked ? stepData['0'].preFields.map(item => { return item.name }) : [],
        indeterminate: false,
        checkAll: e.target.checked,
        stepData: stepData
      }, () => {
        this.postOpertors()
      })
    }

    return (
      <ContentABox>
        <ContentBoxLeft>
          <div style={{ height: '40px', lineHeight: '40px' }}>
            <Input size="small" placeholder="搜索" />
          </div>
          <div style={{ height: '30px', lineHeight: '30px' }}>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>全选</Checkbox>
          </div>
          <Checkbox.Group onChange={onChange} value={selFields}>
            {stepData[0].preFields.map(item => {
              return (
                <div key={item.name} style={{ height: '30px', lineHeight: '30px' }}>
                  <Checkbox value={item.name}>
                    <span>{item.type}</span>
                    <IconSvg name='icontianchongyanse2' />
                    <span>{item.transferName}</span>
                  </Checkbox>
                </div>
              )
            })}
          </Checkbox.Group>
        </ContentBoxLeft >
        <ContentBoxRight>
          <PreviewHeadBox>
            <span>数据预览</span>
            <div>
              {previewHintVisiable ? <PreviewHint>当前设置已修改，点击预览可刷新计算结果</PreviewHint> : null}
              <Button type="primary" size='small' style={{ width: '80px' }} onClick={() => this.preview(0)}>预览</Button>
            </div>
          </PreviewHeadBox>
          {previewData ? < DefinedTable data={previewData} headSetField={{ id: 'name', name: 'transferName' }} /> : null}
        </ContentBoxRight>
      </ContentABox>
    )
  }

  SwitchTypeTem = () => { // 类型转换字段
    const { stepData, invalidOperatorDtoList, previewData, currentStep } = this.state
    let tableData = {}
    if (stepData[1] && stepData[1].fields.length != 0) {
      let columnData = stepData[1].fields.map(item => { return ['', ''] })
      tableData = {
        headerData: [{ name: '字段类型', id: 0 }, { name: '原始名', id: 1 }],
        columnData: columnData
      }
    } else {
      tableData = {
        headerData: [],
        columnData: []
      }
    }
    const handleChange = (value, index) => { // 监听类型转换
      stepData[1].fields[index].type = value
      this.setState({
        stepData: stepData
      }, () => { this.postOpertors() })
    }
    const ColumnTemOne = (res) => {
      return (
        <div>
          <IconSvg name='icontianchongyanse2' />
          <Select defaultValue={stepData[1].fields[res[0]].type} size='small' bordered={false} style={{ width: '80px' }} onChange={(value) => handleChange(value, res[0])} >
            <Select.Option value="STRING">文本</Select.Option>
            <Select.Option value="NUMBER">数值</Select.Option>
            <Select.Option value="DATE">日期</Select.Option>
          </Select >
        </div>

      )
    }
    const delFields = (e, res) => {
      e.stopPropagation()
      stepData[1].fields.splice(res[0], 1)
      stepData[1].preFields.splice(res[0], 1)
      this.setState({
        stepData: stepData
      }, () => { this.postOpertors() })
    }
    const ColumnTemTwo = (res) => {
      let delIcon = false
      if (invalidOperatorDtoList[1]) {
        if (invalidOperatorDtoList[1].missFields.length) {
          const index = invalidOperatorDtoList[1].missFields.findIndex(item => item.name == stepData[1].fields[res[0]].name)
          if (index != -1) {
            delIcon = true
          }
        }
      }
      return (
        <div>
          <span style={{ color: delIcon ? 'red' : null }}>{stepData[1].fields[res[0]].transferName}</span>
          {delIcon ? <span onClick={(e) => delFields(e, res)}><IconSvg name='icontianchongyanse2' /></span> : null}
        </div>
      )
    }
    return (
      <ContentABox>
        <ContentBoxLeft>
          < DefinedTable definedColumn={[0, 1]} definedColumnTem={[ColumnTemOne, ColumnTemTwo]} data={tableData} />
        </ContentBoxLeft>
        <ContentBoxRight>
          <PreviewHeadBox>
            <span>数据预览</span>
            <Button type="primary" size='small' style={{ width: '80px' }} onClick={() => this.preview(1)}>预览</Button>
          </PreviewHeadBox>
          {previewData ? < DefinedTable data={previewData} headSetField={{ id: 'name', name: 'transferName' }} /> : null}
        </ContentBoxRight>
      </ContentABox >
    )
  }

  SwitchMatrixTem = () => { // 行列转换模板
    const plainOptions = ['Apple', 'Pear', 'Orange']
    const defaultCheckedList = ['Apple', 'Orange']
    const { stepData, previewData, invalidOperatorDtoList, matrixOriginFields, matrixColumnData, matrixCheckAll, matrixIndeterminate, matrixSelColumnData, matrixSelOriginFields, matrixNewFields, currentStep } = this.state
    // console.log('------------', stepData)
    const stepIndex = stepData.length - 1
    const onChangeSel = (value) => { // 选择栏名次字段
      const { params } = this.props
      stepData[stepIndex].transFieldName = value
      // postDatasetTransColumnData(params.tableId, stepIndex, value,stepData).then(res => {
      postDatasetTransColumnData(114200743645186, stepIndex, value, stepData).then(res => {
        const matrixColumnData = res.data.data.map((item, index) => { return { id: item + index, newName: item, oldName: item, selected: false } })
        this.setState({
          stepData: stepData,
          matrixColumnData: matrixColumnData,
          matrixSelColumnData: []
        })
      })
    }
    const newFields = () => { // 生成指标字段
      if (this.state.matrixSelColumnData.length && this.state.matrixSelOriginFields.length) {
        const matrixNewFieldsAux = []
        console.log(this.state.matrixColumnData, this.state.matrixOriginFields)
        for (let matrixColumnDataItem of this.state.matrixColumnData) {
          for (let matrixOriginFieldsItem of this.state.matrixOriginFields) {
            if (matrixColumnDataItem.selected && matrixOriginFieldsItem.selected) {
              matrixNewFieldsAux.push({ id: matrixColumnDataItem.id + matrixOriginFieldsItem.name, newName: matrixColumnDataItem.newName + '-' + matrixOriginFieldsItem.newName, oldName: matrixColumnDataItem.newName + '-' + matrixOriginFieldsItem.newName })
            }
          }
        }
        this.setState({
          matrixNewFields: matrixNewFieldsAux
        })
      }
    }

    const onCheckAllChange = e => { // 选择栏次名 - 全选
      if (e.target.checked) {
        for (let item of matrixColumnData) {
          matrixSelColumnData.push(item.id)
          item.selected = true
          stepData[stepIndex].transAllSelected = true
        }
      } else {
        for (let item of matrixColumnData) {
          item.selected = false
          stepData[stepIndex].transAllSelected = false
        }
        matrixSelColumnData.length = 0
      }
      this.setState({
        stepData: stepData,
        matrixColumnData: matrixColumnData,
        matrixSelColumnData: matrixSelColumnData,
        matrixIndeterminate: false,
        matrixCheckAll: e.target.checked
      }, () => { newFields() })
    }

    const onChange = list => { // 选择栏次名 - 单选
      if (list.length == matrixColumnData.length) {
        stepData[stepIndex].transAllSelected = true
      } else {
        stepData[stepIndex].transAllSelected = false
      }
      for (let matrixColumnDataItem of matrixColumnData) { matrixColumnDataItem.selected = false }
      for (let listItem of list) {
        let selectedItem = matrixColumnData.find(matrixColumnDataItem => matrixColumnDataItem.id == listItem)
        selectedItem.selected = true
      }
      stepData[stepIndex].transRowNames = matrixColumnData
      this.setState({
        stepData: stepData,
        matrixColumnData: matrixColumnData,
        matrixSelColumnData: list,
        matrixIndeterminate: list.length != 0 && list.length < matrixColumnData.length,
        matrixCheckAll: list.length === matrixColumnData.length
      }, () => { newFields() })
    }

    const onChangeOrigin = list => { // 原始指标字段 - 单选
      for (let matrixOriginFieldsItem of matrixOriginFields) { matrixOriginFieldsItem.selected = false }
      for (let listItem of list) {
        let selectedItem = matrixOriginFields.find(matrixOriginFieldsItem => matrixOriginFieldsItem.name == listItem)
        selectedItem.selected = true
      }
      stepData[stepIndex].initialFields = matrixOriginFields
      this.setState({
        matrixOriginFields: matrixOriginFields,
        matrixSelOriginFields: list,
        stepData: stepData
      }, () => { newFields() })
    }

    const onChangeSerial = value => { // 序列号根据字段
      stepData[stepIndex].accordingFieldName = value
      this.setState({
        stepData: stepData
      })
    }

    return (
      <ContentTBox>
        <ContentBoxUp>
          <SwitchMatrixHead>
            <span style={{ color: '#666666' }}>序列号根据字段：</span>
            <Select size='small' style={{ width: '160px' }} onChange={onChangeSerial}>
              {stepData[stepIndex].preFields.map(item => {
                return (
                  <Select.Option value={item.name} key={item.name}>{item.transferName}</Select.Option>
                )
              })}
            </Select>
            <span style={{ marginLeft: '10px' }}>识别生成的指标所在列</span>
          </SwitchMatrixHead>
          <SwitchMatrixBody>
            <SwitchMatrixBodyItemBox>
              <SwitchMatrixBodyItemTitle>1.选择栏次名</SwitchMatrixBodyItemTitle>
              <Select size='small' style={{ width: '160px' }} onChange={onChangeSel}>
                {stepData[stepIndex].preFields.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.name}>{item.transferName}</Select.Option>
                  )
                })}
              </Select>
              {
                matrixColumnData.length == 0 ? '没有可用数据' :
                  <SwitchMatrixBodyItemContent>
                    <div style={{ height: '30px', lineHeight: '30px', marginTop: '10px' }}>
                      <Checkbox indeterminate={matrixIndeterminate} onChange={onCheckAllChange} checked={matrixCheckAll}>全选</Checkbox>
                    </div>
                    <Checkbox.Group onChange={onChange} value={matrixSelColumnData}>
                      {matrixColumnData.map(item => {
                        return (
                          <div key={item.id} style={{ height: '30px', lineHeight: '30px' }}>
                            <Checkbox value={item.id}>
                              <span style={{ fontSize: '12px' }}>{item.newName}</span>
                            </Checkbox>
                          </div>
                        )
                      })}
                    </Checkbox.Group>
                  </SwitchMatrixBodyItemContent>
              }
            </SwitchMatrixBodyItemBox>
            <SwitchMatrixBodyItemBox>
              <SwitchMatrixBodyItemTitle>2.原始指标字段</SwitchMatrixBodyItemTitle>
              <SwitchMatrixBodyItemContent>
                <Checkbox.Group onChange={onChangeOrigin} value={matrixSelOriginFields}>
                  {matrixOriginFields.map(item => {
                    return (
                      <div key={item.name} style={{ height: '30px', lineHeight: '30px' }}>
                        <Checkbox value={item.name}>
                          <span style={{ fontSize: '13px' }}>{item.transferName}</span>
                        </Checkbox>
                      </div>
                    )
                  })}
                </Checkbox.Group>
              </SwitchMatrixBodyItemContent>
            </SwitchMatrixBodyItemBox>
            <SwitchMatrixBodyItemBox>
              <SwitchMatrixBodyItemTitle>3.生成的指标字段</SwitchMatrixBodyItemTitle>
              {matrixNewFields.length ?
                <SwitchMatrixBodyItemContent>
                  {matrixNewFields.map(item => {
                    return (
                      <div key={item.id} style={{ height: '30px', lineHeight: '30px', fontSize: '12px' }}>{item.newName}</div>
                    )
                  })}
                </SwitchMatrixBodyItemContent>
                : ''}
            </SwitchMatrixBodyItemBox>

          </SwitchMatrixBody>
        </ContentBoxUp>
        <ContentBoxDown>
          <PreviewHeadBox>
            <span>数据预览</span>
            <Button type="primary" size='small' style={{ width: '80px' }} onClick={() => this.preview(stepIndex)}>预览</Button>
          </PreviewHeadBox>
          {previewData ? < DefinedTable data={previewData} headSetField={{ id: 'name', name: 'transferName' }} /> : null}
        </ContentBoxDown>
      </ContentTBox >
    )
  }

  CirculationTem = () => { // 自循环模板
    const { stepData, previewData, currentStep, matrixCirulationCheckAll, matrixCirulationIndeterminate, matrixCirulationSelData, matrixCirulationIdFields } = this.state
    const { params } = this.props
    const stepIndex = stepData.length - 1
    const onChangeType = value => { // 自循环列类型
      stepData[stepIndex].selfCycleType = value
      this.setState({
        stepData: stepData
      }, () => {
        this.postOpertors()
      })
    }

    const onChangeIdField = value => { // 分层依据ID列
      stepData[stepIndex].idField = value
      this.setState({
        stepData: stepData
      }, () => {
        this.postOpertors()
      })
    }

    const onChangeParentId = value => { // Parent ID 列
      stepData[stepIndex].parentIdConf = stepData[stepIndex].fields.find(item => item.name = value)
      this.setState({
        stepData: stepData
      }, () => {
        this.postOpertors()
      })
    }

    const onCheckAllChange = e => { // 分层结果 - 全选
      if (e.target.checked) {
        matrixCirulationSelData.length = 0
        for (let item of stepData[stepIndex].fields) {
          matrixCirulationSelData.push(item.name)
        }
        stepData[stepIndex].resultField = matrixCirulationSelData
      } else {
        matrixCirulationSelData.length = 0
        stepData[stepIndex].resultField = []
      }
      this.setState({
        stepData: stepData,
        matrixCirulationSelData: matrixCirulationSelData,
        matrixCirulationIndeterminate: false,
        matrixCirulationCheckAll: e.target.checked
      }, () => {
        this.postOpertors()
      })
    }

    const onChange = list => { // 分层结果 - 单选
      stepData[stepIndex].resultField = list
      this.setState({
        stepData: stepData,
        matrixCirulationSelData: list,
        matrixIndeterminate: list.length != 0 && list.length < stepData[stepIndex].fields.length,
        matrixCheckAll: list.length === stepData[stepIndex].fields.length
      }, () => {
        this.postOpertors()
      })
    }

    const definedSelectContent = (res) => { // 分层结果字段多选模板
      console.log('definedSelectContent-------', res)
      return (
        <CriculationDefinesSelectBox>
          <CriculationDefinesSelectContent>
            <div style={{ height: '30px', lineHeight: '30px', padding: '0 8px' }}>
              <Checkbox indeterminate={matrixCirulationIndeterminate} onChange={onCheckAllChange} checked={matrixCirulationCheckAll}>全选</Checkbox>
            </div>
            <Checkbox.Group onChange={onChange} value={matrixCirulationSelData}>
              {stepData[stepIndex].fields.map(item => {
                return (
                  <div key={item.name} style={{ height: '30px', lineHeight: '30px', padding: '0 8px' }}>
                    <Checkbox value={item.name}>
                      <span>{item.type}</span>
                      <IconSvg name='icontianchongyanse2' />
                      <span>{item.transferName}</span>
                    </Checkbox>
                  </div>
                )
              })}
            </Checkbox.Group>
          </CriculationDefinesSelectContent>
          <div>
            底部按钮
          </div>
        </CriculationDefinesSelectBox>
      )
    }

    const buildRelation = () => { // 构建关系
      // postDatasetSelfCycleBuild(params.tableId, stepIndex, stepData).then(res => {
      postDatasetSelfCycleBuild(114200743645186, stepIndex, stepData).then(res => {
        const matrixCirulationIdFieldsAux = stepData[stepIndex].fields.find(item => item.name == stepData[stepIndex].idField)
        stepData[stepIndex].levels = res.data.data.levels
        stepData[stepIndex].oneFieldConf = res.data.data.oneFieldConf
        stepData[stepIndex].parentIdConf = res.data.data.parentIdConf
        this.setState({
          stepData: stepData,
          matrixCirulationIdFields: matrixCirulationIdFieldsAux
        }, () => {
          console.log('构建关系', this.state)
        })

      })
    }
    return (
      <ContentTBox>
        <ContentBoxUp style={{ display: 'flex' }}>
          <CriculationHeaderLeft>
            <CriculationItem>
              <CriculationLabel>自循环列类型：</CriculationLabel>
              <Select style={{ width: '180px' }} size='small' onChange={onChangeType} defaultValue={stepData[stepIndex].selfCycleType}>
                <Select.Option value='ONE_FIELD'>根据一列数据分层</Select.Option>
                <Select.Option value='PARENT_ID'>根据两列数据分层</Select.Option>
              </Select>
            </CriculationItem>
            <CriculationItem>
              <CriculationLabel>分层结果字段：</CriculationLabel>
              <Select dropdownRender={menu => definedSelectContent(menu)} style={{ width: '180px' }} size='small'></Select>
            </CriculationItem>
            <CriculationItem>
              <CriculationLabel>分层依据ID列：</CriculationLabel>
              <Select style={{ width: '180px' }} size='small' onChange={onChangeIdField} defaultValue={stepData[stepIndex].idField} >
                {
                  stepData[stepIndex].fields.map(item => {
                    return (
                      <Select.Option value={item.name} key={item.name}>{item.transferName}</Select.Option>
                    )
                  })
                }
              </Select>
            </CriculationItem>
            {
              stepData[stepIndex].selfCycleType == 'ONE_FIELD' && stepData[stepIndex].oneFieldConf.lengthEquals ?
                <CriculationItem>
                  <CriculationLabel>分层长度：</CriculationLabel>
                  <Input style={{ width: '180px' }} size="small" defaultValue={stepData[stepIndex].oneFieldConf.fieldLength} />
                </CriculationItem>
                : null
            }
            {
              stepData[stepIndex].selfCycleType == 'PARENT_ID' ?
                <CriculationItem>
                  <CriculationLabel>Parent ID列：</CriculationLabel>
                  <Select style={{ width: '180px' }} size='small' onChange={onChangeParentId} >
                    {
                      stepData[stepIndex].fields.map(item => {
                        return (
                          <Select.Option value={item.name} key={item.name}>{item.transferName}</Select.Option>
                        )
                      })
                    }
                  </Select>
                </CriculationItem>
                : null
            }
          </CriculationHeaderLeft>
          <CriculationHeaderRight>
            <Button type="primary" size='small' style={{ width: '80px' }} onClick={() => buildRelation()}>构建关系</Button>
            {
              matrixCirulationIdFields ?
                <>
                  <div>分层依据的ID列为：{matrixCirulationIdFields.transferName}</div>
                  {stepData[stepIndex].levels.map(item => {
                    return (
                      <div key={item.level} style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <Input defaultValue={item.name} size='small' />
                        {item.values.map((items, index) => {
                          return (
                            <span key={items + index} style={{ padding: '0 5px' }}>{items}</span>
                          )
                        })}
                      </div>
                    )
                  })}
                </>
                : ''
            }

          </CriculationHeaderRight>
        </ContentBoxUp>
        <ContentBoxDown>
          <PreviewHeadBox>
            <span>数据预览</span>
            <Button type="primary" size='small' style={{ width: '80px' }} onClick={() => this.preview(stepIndex)}>预览</Button>
          </PreviewHeadBox>
          {previewData ? < DefinedTable data={previewData} headSetField={{ id: 'name', name: 'transferName' }} /> : null}
        </ContentBoxDown>
      </ContentTBox>
    )
  }

  stepTem = () => { // 步骤模板
    const { stepData, invalidOperatorDtoList, addBtVisiable, transferTypeVisiable, currentStep } = this.state
    const switchTem = (name) => {
      this.setState({
        currentStep: name
      })
    }
    const switchTemSel = () => { // 步骤按钮的选择字段
      this.setState({
        currentStep: 'selFields'
      })

    }
    const switchTemTransfer = () => { // 步骤按钮 - 字段转换
      if (currentStep == 'transferType') { return }
      // let addFieldsAux = []
      // for (let item of stepData[0].fields) {
      //   let addFieldsAuxItem = stepData[1].fields.find(res => { return item.name == res.name })
      //   addFieldsAux.push(addFieldsAuxItem)
      // }

      if (invalidOperatorDtoList[1] && invalidOperatorDtoList[1].addedFields.length != 0) {
        const addPreFields = JSON.parse(JSON.stringify(invalidOperatorDtoList[1].addedFields))
        const addFields = JSON.parse(JSON.stringify(invalidOperatorDtoList[1].addedFields))
        stepData[1].preFields = stepData[1].preFields.concat(addPreFields)
        stepData[1].fields = stepData[1].fields.concat(addFields)
        this.setState({
          stepData: stepData,
          currentStep: 'transferType',
          previewData: null
        })
      } else {
        this.setState({
          currentStep: 'transferType'
        })
      }
    }

    const switchTemMatrix = () => { // 步骤按钮 - 行列转换
      if (currentStep == 'switchMatrix') { return }
      const stepIndex = stepData.length - 1
      if (invalidOperatorDtoList[stepIndex] && invalidOperatorDtoList[stepIndex].addedFields.length != 0) {
        const addPreFields = JSON.parse(JSON.stringify(invalidOperatorDtoList[stepIndex].addedFields))
        const addFields = JSON.parse(JSON.stringify(invalidOperatorDtoList[stepIndex].addedFields))
        stepData[stepIndex].preFields = stepData[stepIndex].preFields.concat(addPreFields)
        stepData[stepIndex].fields = stepData[stepIndex].fields.concat(addFields)
        console.log('--------------', stepData)
        this.setState({
          stepData: stepData,
          currentStep: 'switchMatrix',
          previewData: null
        })
      } else {
        this.setState({
          currentStep: 'switchMatrix',
          previewData: null
        })
      }
    }

    const switchTemCriculation = () => { // 步骤按钮 - 自循环列
      if (currentStep == 'circulation') { return }
      const stepIndex = stepData.length - 1
      if (invalidOperatorDtoList[stepIndex] && invalidOperatorDtoList[stepIndex].addedFields.length != 0) {
        const addPreFields = JSON.parse(JSON.stringify(invalidOperatorDtoList[stepIndex].addedFields))
        const addFields = JSON.parse(JSON.stringify(invalidOperatorDtoList[stepIndex].addedFields))
        stepData[stepIndex].preFields = stepData[stepIndex].preFields.concat(addPreFields)
        stepData[stepIndex].fields = stepData[stepIndex].fields.concat(addFields)
        console.log('--------------', stepData)
        this.setState({
          stepData: stepData,
          currentStep: 'circulation',
          previewData: null
        })
      } else {
        this.setState({
          currentStep: 'circulation',
          previewData: null
        })
      }
    }

    const addEditType = (e, type) => { // 修改方式
      const stepDataItem = {}
      let matrixOriginFields = null
      const length = stepData.length - 1
      stepDataItem.preFields = JSON.parse(JSON.stringify(stepData[length].fields))
      stepDataItem.fields = JSON.parse(JSON.stringify(stepData[length].fields))
      if (type == 'transferType') { // 类型转换
        stepDataItem.type = 'DATA_TYPE'
        stepData.push(stepDataItem)
        this.setState({
          stepData: stepData,
          currentStep: type,
          transferTypeVisiable: false
        }, () => {
          this.postOpertors()
        })
      } else if (type == 'switchMatrix') { // 行列转换
        matrixOriginFields = JSON.parse(JSON.stringify(stepData[length].fields))
        for (let item of matrixOriginFields) {
          item.newName = item.transferName
          item.oldName = item.transferName
          item.selected = false
        }
        stepDataItem.type = 'ROW_TRANS_COLUMN'
        stepDataItem.accordingFieldName = null
        stepDataItem.initialFields = []
        stepDataItem.transAllSelected = null
        stepDataItem.transFieldName = null
        stepDataItem.transRowNames = []
        stepData.push(stepDataItem)
        this.setState({
          stepData: stepData,
          currentStep: type,
          matrixOriginFields: matrixOriginFields,
          addBtVisiable: false,
          previewData: null
        }, () => {
          this.postOpertors()
        })
      } else if (type == 'circulation') { // 自循环列
        stepDataItem.type = 'SELF_CYCLE'
        stepDataItem.idField = '' // 分层依据ID列
        stepDataItem.levels = [] // 分层信息
        stepDataItem.oneFieldConf = {} // 根据一列分层
        stepDataItem.parentIdConf = {} // 根据两列分层
        stepDataItem.resultField = [] // 分层结果字段
        stepDataItem.selfCycleType = 'ONE_FIELD' // 自循环列类型
        stepData.push(stepDataItem)
        this.setState({
          stepData: stepData,
          currentStep: type,
          addBtVisiable: false,
          previewData: null
        }, () => {
          this.postOpertors()
        })
      }

      this.refs.popover.onClick(e)
    }

    const insetTransfer = () => { // 插入字段转换
      const stepDataItem = {}
      stepDataItem.type = 'DATA_TYPE'
      stepDataItem.preFields = JSON.parse(JSON.stringify(stepData[0].fields))
      stepDataItem.fields = JSON.parse(JSON.stringify(stepData[1].preFields))
      stepData.splice(1, 0, stepDataItem)
      this.setState({
        stepData: stepData,
        currentStep: 'transferType',
        previewData: null
      }, () => {
        this.postOpertors()
      })
    }
    const popverContentTem = () => {
      return (
        <div>
          {transferTypeVisiable ? <div onClick={(e) => addEditType(e, 'transferType')}><IconSvg name='icontianchongyanse2' />字段类型转换</div> : null}
          <div onClick={(e) => addEditType(e, 'switchMatrix')}><IconSvg name='icontianchongyanse2' />行列转换</div>
          <div onClick={(e) => addEditType(e, 'circulation')}><IconSvg name='icontianchongyanse2' />自循环列</div>
        </div>
      )
    }

    const delStep = (index) => { // 删除步骤
      let currentStepAux = null
      let addBtVisiableAux = null
      let transferTypeVisiableAux = null
      if (stepData.length == 3 && index == 2) {
        currentStepAux = 'transferType'
        addBtVisiableAux = true
      } else if (stepData.length == 3 && index == 1) {
        currentStepAux = 'selFields'
        transferTypeVisiableAux = true
        addBtVisiableAux = false
      } else {
        currentStepAux = 'selFields'
        addBtVisiableAux = true
        transferTypeVisiableAux = true
      }
      stepData.splice(index, 1)
      this.setState({
        stepData: stepData,
        currentStep: currentStepAux,
        addBtVisiable: addBtVisiableAux,
        transferTypeVisiable: transferTypeVisiableAux
      }, () => {
        this.postOpertors()
      })
    }
    return (
      <StepBox>
        <StepItemBox>
          <StepItemBt onClick={() => switchTemSel()}><IconSvg name='iconzitiyanse2' />选择字段</StepItemBt>
        </StepItemBox>
        {
          stepData.map((item, index) => {
            if (item.type == 'DATA_TYPE') {
              return (
                <StepItemBox key={item.type} style={{ color: invalidOperatorDtoList[index] && invalidOperatorDtoList[index].missFields.length ? 'red' : '' }}>
                  <StepItemLine></StepItemLine>
                  <StepItemBt onClick={() => switchTemTransfer()}>
                    <IconSvg name='iconzitiyanse2' />
                    <span>字段类型转换</span>
                    <IconSvg name='icontianchongyanse2' onClick={() => delStep(index)} />
                  </StepItemBt>
                </StepItemBox>
              )
            } else if (item.type == 'ROW_TRANS_COLUMN') {
              return (
                <StepItemBox key={item.type} style={{ color: invalidOperatorDtoList[index] && invalidOperatorDtoList[index].missFields.length ? 'red' : '' }}>
                  <StepItemLine>
                    {stepData[1].type != 'DATA_TYPE' ?
                      <span style={{ position: 'absolute', left: '50%', top: '-9px' }} onClick={() => insetTransfer()}>
                        <IconSvg name='iconshangyiye2' />
                      </span>
                      : null
                    }
                  </StepItemLine>
                  <StepItemBt onClick={() => switchTemMatrix()}>
                    <IconSvg name='iconzitiyanse2' />
                    <span>行列转换</span>
                    <IconSvg name='icontianchongyanse2' onClick={() => delStep(index)} />
                  </StepItemBt>
                </StepItemBox>
              )
            } else if (item.type == 'SELF_CYCLE') {
              return (
                <StepItemBox key={item.type} style={{ color: invalidOperatorDtoList[index] && invalidOperatorDtoList[index].missFields.length ? 'red' : '' }}>
                  <StepItemLine>
                    {stepData[1].type != 'DATA_TYPE' ?
                      <span style={{ position: 'absolute', left: '50%', top: '-9px' }} onClick={() => insetTransfer()}>
                        <IconSvg name='iconshangyiye2' />
                      </span>
                      : null
                    }
                  </StepItemLine>
                  <StepItemBt onClick={() => switchTemCriculation()}>
                    <IconSvg name='iconzitiyanse2' />
                    <span>自循环列</span>
                    <IconSvg name='icontianchongyanse2' onClick={() => delStep(index)} />
                  </StepItemBt>
                </StepItemBox>
              )
            }
          })
        }
        {
          addBtVisiable ?
            <StepItemBox>
              <StepItemLine></StepItemLine>
              <Popover ref='popover' content={popverContentTem()} trigger="click" placement="bottom">
                <StepAddBt>添加</StepAddBt>
              </Popover>
            </StepItemBox> : ''
        }
      </StepBox>
    )
  }

  HeaderTem = () => { // 头部模板
    const { stepData, tableName } = this.state
    const confirm = () => {
      console.log('confirm------------', stepData)
    }
    return (
      <HeaderBox>
        <HeaderLeft onClick={() => { temSwitch('Home', params) }}>
          <IconSvg name='iconshangyiye2' />
          <span>{tableName}</span>
        </HeaderLeft>
        <Button type="primary" size='small' style={{ width: '80px' }} onClick={() => confirm()}>保存</Button>
      </HeaderBox>
    )
  }


  render () {
    const { stepData, currentStep } = this.state
    const { temSwitch, params } = this.props
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {this.HeaderTem()}
        {this.stepTem()}
        {currentStep == 'selFields' && stepData[0] ? this.SelFieldTem() : null}
        {currentStep == 'transferType' ? this.SwitchTypeTem() : null}
        {currentStep == 'switchMatrix' ? this.SwitchMatrixTem() : null}
        {currentStep == 'circulation' ? this.CirculationTem() : null}
      </div>
    )
  }
}

export default DatasetEdit