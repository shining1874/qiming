// data/poetry.js
// 知行起名 · 古典诗词取名库
// 从《诗经》《楚辞》及历代诗词中撷取意境佳句，提取可作风雅名字的词句。
// 仅作中华文学与姓名的赏析参考，不构成任何命运断言。

const POETRY = [
  // ===== 诗经 =====
  { cat: '诗经', book: '诗经·郑风', sentence: '琴瑟在御，莫不静好。', names: [{ name: '静好', py: 'jìng hǎo', yy: '岁月静好，安宁和美' }] },
  { cat: '诗经', book: '诗经·卫风', sentence: '投我以木桃，报之以琼瑶。', names: [{ name: '琼瑶', py: 'qióng yáo', yy: '美玉无瑕，温润珍贵' }, { name: '木桃', py: 'mù táo', yy: '质朴天真，自然可喜' }] },
  { cat: '诗经', book: '诗经·秦风', sentence: '蒹葭苍苍，白露为霜。', names: [{ name: '蒹葭', py: 'jiān jiā', yy: '水边芦苇，清远苍茫' }, { name: '白露', py: 'bái lù', yy: '晶莹清润，纯净无瑕' }] },
  { cat: '诗经', book: '诗经·小雅', sentence: '高山仰止，景行行止。', names: [{ name: '景行', py: 'jǐng xíng', yy: '光明大道，德行昭彰' }, { name: '高山', py: 'gāo shān', yy: '稳重崇峻，令人仰止' }] },
  { cat: '诗经', book: '诗经·大雅', sentence: '凤凰鸣矣，于彼高冈。', names: [{ name: '凤鸣', py: 'fèng míng', yy: '凤鸣朝阳，声名远扬' }] },
  { cat: '诗经', book: '诗经·周南', sentence: '桃之夭夭，灼灼其华。', names: [{ name: '灼华', py: 'zhuó huá', yy: '光彩鲜明，繁盛美好' }, { name: '夭夭', py: 'yāo yāo', yy: '生机盎然，柔美和悦' }] },
  { cat: '诗经', book: '诗经·周南', sentence: '南有乔木，不可休思。', names: [{ name: '乔木', py: 'qiáo mù', yy: '高大挺拔，自立有成' }] },
  { cat: '诗经', book: '诗经·小雅', sentence: '采薇采薇，亦采亦柔。', names: [{ name: '采薇', py: 'cǎi wēi', yy: '采食野菜，坚韧柔美' }] },
  { cat: '诗经', book: '诗经·郑风', sentence: '野有蔓草，零露漙兮。', names: [{ name: '蔓草', py: 'màn cǎo', yy: '蔓蔓青草，生生不息' }, { name: '零露', py: 'líng lù', yy: '清露晶莹，晨光可喜' }] },
  { cat: '诗经', book: '诗经·邶风', sentence: '燕燕于飞，差池其羽。', names: [{ name: '于飞', py: 'yú fēi', yy: '比翼而飞，相伴相随' }] },
  { cat: '诗经', book: '诗经·卫风', sentence: '手如柔荑，肤如凝脂。', names: [{ name: '柔荑', py: 'róu tí', yy: '柔白如芽，温润可人' }] },
  { cat: '诗经', book: '诗经·周南', sentence: '关关雎鸠，在河之洲。', names: [{ name: '洲', py: 'zhōu', yy: '水中绿洲，安稳栖息' }] },
  // ===== 楚辞 =====
  { cat: '楚辞', book: '楚辞·离骚', sentence: '路漫漫其修远兮，吾将上下而求索。', names: [{ name: '修远', py: 'xiū yuǎn', yy: '路长道远，求索不息' }, { name: '求索', py: 'qiú suǒ', yy: '探求真理，志在远方' }] },
  { cat: '楚辞·九歌', sentence: '沅有芷兮澧有兰，思公子兮未敢言。', names: [{ name: '芷兰', py: 'zhǐ lán', yy: '香草美人，高洁清芬' }] },
  { cat: '楚辞·离骚', sentence: '朝饮木兰之坠露兮，夕餐秋菊之落英。', names: [{ name: '木兰', py: 'mù lán', yy: '木兰坠露，高洁清雅' }, { name: '落英', py: 'luò yīng', yy: '繁花落瓣，从容自在' }] },
  { cat: '楚辞·九歌', sentence: '青云衣兮白霓裳，举长矢兮射天狼。', names: [{ name: '青云', py: 'qīng yún', yy: '青云直上，志存高远' }] },
  { cat: '楚辞·九章', sentence: '秉德无私，参天地兮。', names: [{ name: '秉德', py: 'bǐng dé', yy: '秉持美德，光明无私' }] },
  { cat: '楚辞·离骚', sentence: '佩缤纷其繁饰兮，芳菲菲其弥章。', names: [{ name: '缤纷', py: 'bīn fēn', yy: '繁盛绚丽，芬芳远扬' }] },
  { cat: '楚辞·九歌', sentence: '疏缓节兮安歌，陈竽瑟兮浩倡。', names: [{ name: '安歌', py: 'ān gē', yy: '安然而歌，从容自在' }] },
  { cat: '楚辞·招魂', sentence: '兰膏明烛，华容备些。', names: [{ name: '华容', py: 'huá róng', yy: '华美姿容，光彩照人' }] },
  { cat: '楚辞·离骚', sentence: '民生各有所乐兮，余独好修以为常。', names: [{ name: '好修', py: 'hǎo xiū', yy: '修美自好，洁身自持' }] },
  // ===== 唐诗 =====
  { cat: '唐诗', book: '王维·山居秋暝', sentence: '明月松间照，清泉石上流。', names: [{ name: '清泉', py: 'qīng quán', yy: '清泉石上，澄澈明洁' }, { name: '松间', py: 'sōng jiān', yy: '松间明月，清逸脱俗' }] },
  { cat: '唐诗', book: '李白·宣州谢朓楼', sentence: '俱怀逸兴壮思飞，欲上青天揽明月。', names: [{ name: '逸兴', py: 'yì xìng', yy: '超逸兴致，洒脱不群' }] },
  { cat: '唐诗', book: '杜甫·望岳', sentence: '会当凌绝顶，一览众山小。', names: [{ name: '凌岳', py: 'líng yuè', yy: '凌越山岳，志向高远' }] },
  { cat: '唐诗', book: '王勃·滕王阁序', sentence: '落霞与孤鹜齐飞，秋水共长天一色。', names: [{ name: '落霞', py: 'luò xiá', yy: '落霞孤鹜，绚烂悠远' }, { name: '长天', py: 'cháng tiān', yy: '长空辽阔，胸襟开阔' }] },
  { cat: '唐诗', book: '王维·相思', sentence: '红豆生南国，春来发几枝。', names: [{ name: '南国', py: 'nán guó', yy: '南方故土，温润多情' }, { name: '相思', py: 'xiāng sī', yy: '情意深长，绵邈动人' }] },
  { cat: '唐诗', book: '李白·行路难', sentence: '长风破浪会有时，直挂云帆济沧海。', names: [{ name: '云帆', py: 'yún fān', yy: '云间风帆，乘风远航' }] },
  { cat: '唐诗', book: '刘禹锡·望洞庭', sentence: '遥望洞庭山水翠，白银盘里一青螺。', names: [{ name: '青螺', py: 'qīng luó', yy: '青螺点翠，小巧玲珑' }] },
  { cat: '唐诗', book: '孟浩然·宿建德江', sentence: '野旷天低树，江清月近人。', names: [{ name: '江月', py: 'jiāng yuè', yy: '江上明月，清辉可亲' }] },
  { cat: '唐诗', book: '李白·静夜思', sentence: '举头望明月，低头思故乡。', names: [{ name: '望舒', py: 'wàng shū', yy: '望月而行，温柔光明' }] },
  { cat: '唐诗', book: '王之涣·登鹳雀楼', sentence: '欲穷千里目，更上一层楼。', names: [{ name: '千里', py: 'qiān lǐ', yy: '志在千里，视野宏阔' }] },
  // ===== 宋词 =====
  { cat: '宋词', book: '苏轼·水调歌头', sentence: '但愿人长久，千里共婵娟。', names: [{ name: '婵娟', py: 'chán juān', yy: '明月美人，美好婵娟' }, { name: '长久', py: 'cháng jiǔ', yy: '平安长久，情谊绵长' }] },
  { cat: '宋词', book: '辛弃疾·青玉案', sentence: '众里寻他千百度，蓦然回首，那人却在灯火阑珊处。', names: [{ name: '千度', py: 'qiān dù', yy: '千回百转，终有所获' }, { name: '阑珊', py: 'lán shān', yy: '灯火微明，静美从容' }] },
  { cat: '宋词', book: '李清照·如梦令', sentence: '知否，知否，应是绿肥红瘦。', names: [{ name: '知否', py: 'zhī fǒu', yy: '知意会心，从容自省' }] },
  { cat: '宋词', book: '柳永·雨霖铃', sentence: '杨柳岸，晓风残月。', names: [{ name: '晓风', py: 'xiǎo fēng', yy: '晓风残月，清丽凄美' }] },
  { cat: '宋词', book: '秦观·鹊桥仙', sentence: '两情若是久长时，又岂在朝朝暮暮。', names: [{ name: '久长', py: 'jiǔ cháng', yy: '情谊久长，恒久弥珍' }] },
  { cat: '宋词', book: '苏轼·定风波', sentence: '一蓑烟雨任平生。', names: [{ name: '烟雨', py: 'yān yǔ', yy: '烟雨平生，旷达从容' }, { name: '任平', py: 'rèn píng', yy: '任运自然，平和无争' }] },
  { cat: '宋词', book: '辛弃疾·西江月', sentence: '明月别枝惊鹊，清风半夜鸣蝉。', names: [{ name: '别枝', py: 'bié zhī', yy: '别枝惊鹊，灵动生趣' }] },
  { cat: '宋词', book: '范仲淹·苏幕遮', sentence: '明月楼高休独倚，酒入愁肠，化作相思泪。', names: [{ name: '楼高', py: 'lóu gāo', yy: '登高望远，胸襟开阔' }] },
  { cat: '宋词', book: '晏殊·浣溪沙', sentence: '满目山河空念远，落花风雨更伤春。', names: [{ name: '念远', py: 'niàn yuǎn', yy: '念及远方，情深意重' }] }
];

const CATS = ['诗经', '楚辞', '唐诗', '宋词'];

module.exports = { POETRY, CATS };
