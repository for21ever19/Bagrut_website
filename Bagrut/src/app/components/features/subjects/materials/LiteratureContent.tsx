import LiteratureContent15 from './LiteratureContent15' // Поэзия еврейского Средневековья (Введение)
import LiteratureContent16 from './LiteratureContent16' // "Спящая в объятиях детства"
import LiteratureContent17 from './LiteratureContent17' // "Сердце моё на Востоке"
import LiteratureContent18 from './LiteratureContent18' // "Посмотри на солнце"
import LiteratureContent19 from './LiteratureContent19' // "Шфаль руах"
import LiteratureContent3 from './LiteratureContent3' // "Рабби Янай и торговец"
import LiteratureContent4 from './LiteratureContent4' // "Мар Уква и его жена"
import LiteratureContent1 from './LiteratureContent1' // "Смотри, земля"
import LiteratureContent2 from './LiteratureContent2' // "Сосна"
import LiteratureContent10 from './LiteratureContent10' // "Пéгиша, хáци пéгиша"
import LiteratureContent11 from './LiteratureContent11' // "Зéмер нóга"
import LiteratureContent12 from './LiteratureContent12' // "Ещё возвращается напев"
import LiteratureContent13 from './LiteratureContent13' // "Пловцы"
import LiteratureContent14 from './LiteratureContent14' // "Твой лоб увенчан чёрным золотом"
import LiteratureContent5 from './LiteratureContent5' // "Я не получил свет даром"
import LiteratureContent6 from './LiteratureContent6' // "Она сидела у окна"
import LiteratureContent7 from './LiteratureContent7' // "Левáди"
import LiteratureContent8 from './LiteratureContent8' // "Введи меня под крыло твоё"
import LiteratureContent9 from './LiteratureContent9' // "Тоска"
import LiteratureContent20 from './LiteratureContent20' // "Госпожа и торговец"
import LiteratureContent21 from './LiteratureContent21' // "Слепая"
import LiteratureContent22 from './LiteratureContent22' // "Хизо Батата"

export default function LiteratureContent() {
  return (
    <div className="prose prose-stone prose-lg max-w-none">
      <h1>Литература: Полный курс</h1>
      
      {/* Поэзия еврейского Средневековья */}
      <h2 id="medieval-poetry" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Поэзия еврейского Средневековья
      </h2>
      <div id="medieval-intro" className="mb-24">
        <LiteratureContent15 />
      </div>
      <div id="sleeping-childhood" className="mb-24">
        <LiteratureContent16 />
      </div>
      <div id="heart-east" className="mb-24">
        <LiteratureContent17 />
      </div>
      <div id="look-sun" className="mb-24">
        <LiteratureContent18 />
      </div>
      <div id="humble-spirit" className="mb-24">
        <LiteratureContent19 />
      </div>

      {/* Деяния мудрецов */}
      <h2 id="maase-hachamim" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Деяния мудрецов
      </h2>
      <div id="rabbi-yanai-merchant" className="mb-24">
        <LiteratureContent3 />
      </div>
      <div id="mar-ukva-wife" className="mb-24">
        <LiteratureContent4 />
      </div>

      {/* Новая поэзия */}
      <h2 id="new-poetry" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Новая поэзия
      </h2>
      <div id="look-earth" className="mb-24">
        <LiteratureContent1 />
      </div>
      <div id="pine" className="mb-24">
        <LiteratureContent2 />
      </div>
      <div id="meeting-half-meeting" className="mb-24">
        <LiteratureContent10 />
      </div>
      <div id="sad-melody" className="mb-24">
        <LiteratureContent11 />
      </div>
      <div id="melody-returns" className="mb-24">
        <LiteratureContent12 />
      </div>
      <div id="swimmers" className="mb-24">
        <LiteratureContent13 />
      </div>
      <div id="black-gold-forehead" className="mb-24">
        <LiteratureContent14 />
      </div>

      {/* Бялик */}
      <h2 id="bialik" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Бялик
      </h2>
      <div id="light-not-free" className="mb-24">
        <LiteratureContent5 />
      </div>
      <div id="sat-window" className="mb-24">
        <LiteratureContent6 />
      </div>
      <div id="alone" className="mb-24">
        <LiteratureContent7 />
      </div>
      <div id="bring-under-wing" className="mb-24">
        <LiteratureContent8 />
      </div>

      {/* Тоска */}
      <h2 id="toska" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Тоска
      </h2>
      <div id="toska-chekhov" className="mb-24">
        <LiteratureContent9 />
      </div>

      {/* Госпожа и торговец */}
      <h2 id="mistress-merchant" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Госпожа и торговец
      </h2>
      <div id="mistress-merchant-agnon" className="mb-24">
        <LiteratureContent20 />
      </div>

      {/* Слепая */}
      <h2 id="blind" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Слепая
      </h2>
      <div id="blind-steinberg" className="mb-24">
        <LiteratureContent21 />
      </div>

      {/* Хизо Батата */}
      <h2 id="hizo-batata" className="text-2xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-gray-300 pb-3">
        Хизо Батата
      </h2>
      <div id="hizo-batata-bardogo" className="mb-24">
        <LiteratureContent22 />
      </div>
    </div>
  )
}

