import {InterfaceDefinition} from "../../src/java/definition/InterfaceDefinition";
import {InterfaceGenerator} from "../../src/java/generator/InterfaceGenerator";
import {ClassDefinition} from "../../src/java/definition/ClassDefinition";
import {XyMapperDefinitions} from "../../src/java/definition/common/XyMapperDefinitions";

const TbCommodityMapper = new InterfaceDefinition('com.cgmanage.web.modules.ypx.mapper', 'TbCommodityMapper',[],[],'商品Mapper接口');

const TbCommodity = new ClassDefinition('com.cgmanage.web.modules.ypx.entity', 'TbCommodity');

TbCommodityMapper.addBaseInterface(XyMapperDefinitions.mapper(TbCommodity));
TbCommodityMapper.addBaseInterface(XyMapperDefinitions.batchMapper(TbCommodity));
TbCommodityMapper.addBaseInterface(XyMapperDefinitions.searchMapper(TbCommodity));

test('generate', () => {
   console.log(InterfaceGenerator.generate(TbCommodityMapper))
});