export default function LiteratureContent15() {
    return (
      <section className="prose prose-stone prose-lg max-w-none">
        {/* Header Section */}
        <header className="mb-8 border-b border-gray-200 pb-6">
          <h1 id="title" className="text-3xl md:text-4xl font-bold text-ink mb-2">Поэзия еврейского Средневековья</h1>
          <p className="text-xl text-ink opacity-80 font-medium">Введение для курса литературы</p>
        </header>
  
        {/* Definition */}
        <article id="definition" className="mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">1. Определение и география</h2>
          <p className="mb-4 text-ink">
            Под <strong>поэзией еврейского Средневековья</strong> понимают корпус стихотворений на иврите, созданных еврейскими авторами в странах арабо-мусульманского мира. Эта поэзия сложилась как высокоразвитая литературная традиция с правилами построения стиха.
          </p>
          <div className="pl-6 border-l-4 border-[#E1C858] my-6">
            <p className="mb-0 text-ink">
              Центральной ареной её расцвета стала <strong>мусульманская Испания</strong>, где еврейская культура развивалась в диалоге с арабской школой. Позже традиция распространилась во Францию и Италию.
            </p>
          </div>
        </article>
  
        {/* Chronology */}
        <article id="chronology" className="mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">2. Хронологические рамки</h2>
          <p className="mb-4 text-ink">
            Классический период датируют приблизительно <strong>X–XV веками</strong>. В эти столетия сформировались основные жанры, нормы поэтики и появились наиболее влиятельные имена, входящие в учебные программы.
          </p>
        </article>
  
        {/* Transmission */}
        <article id="transmission" className="mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">3. Сохранение и передача текстов</h2>
          <p className="mb-4 text-ink">
            Стихотворения распространялись <strong>рукописным путём</strong>. Они переписывались в сборники, входили в личные и общинные «тетради». Тексты, получившие признание, жили дольше: их читали публично, исполняли как песни или включали в литургию. Невостребованные тексты могли исчезнуть, так как передача зависела от спроса.
          </p>
        </article>
  
        {/* Key Poets */}
        <article id="poets" className="mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">4. Ведущие поэты эпохи</h2>
          <p className="mb-4 text-ink">
            Поэзия связана с именами авторов «золотого века», которые формировали канон:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-ink">
            <li><strong>Йегуда ха-Леви</strong></li>
            <li><strong>Шломо ибн Гвироль</strong></li>
            <li><strong>Шломо ибн Эзра</strong></li>
            <li><strong>Шмуэль ха-Нагид</strong></li>
          </ul>
        </article>
  
        {/* Themes: Sacred vs Secular */}
        <article id="themes" className="mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">5. Тематика: «Священное» и «Мирское»</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-bold text-ink mb-3">Религиозная поэзия (Поэзия святости)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-ink">
                <li>Гимны прославления</li>
                <li>Стихотворения о субботе и праздниках</li>
                <li>Молитвы, просьбы, обращения к Богу</li>
                <li>Тоска по Земле Израиля как святому пространству</li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-xl font-bold text-ink mb-3">Светская поэзия (Поэзия мира)</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-ink">
                <li>Природа, времена года</li>
                <li>Песни о вине и пирах</li>
                <li>Любовная лирика, свадебные песни</li>
                <li>Философская поэзия (судьба, смысл жизни)</li>
              </ul>
            </div>
          </div>
          <p className="text-sm italic mb-4 text-ink">
            * Тема тоски по Сиону («сионидная») может встречаться в обоих контекстах.
          </p>
        </article>
  
        {/* Poetics and Terms */}
        <article id="poetics" className="mb-8">
          <h2 className="text-2xl font-semibold text-ink mb-4">6. Поэтические особенности и термины</h2>
          <ul className="list-disc list-inside space-y-4 mb-4 text-ink">
            <li>
              <strong>Деление строки:</strong> Строка делится на две части. Первая половина — подготовительная, вторая — завершает мысль и рифмует, создавая симметрию.
            </li>
            <li>
              <strong>Акростих:</strong> Поэт «прячет» имя или ключевую идею в первых буквах строк. Знак мастерства и дополнительный смысловой уровень.
            </li>
            <li>
              <strong>Эффектное открытие:</strong> Первая строфа задаёт тему и тональность, сразу привлекая внимание читателя.
            </li>
            <li>
              <strong>Строгая рифмовка:</strong> Использование единого повторяющегося рифменного элемента создаёт ритмический каркас и торжественность.
            </li>
            <li>
              <strong>Параллельные конструкции:</strong> Повтор мысли разными словами (синонимический параллелизм) или через противопоставление (антитеза) для усиления эффекта.
            </li>
            <li>
              <strong>Библейские включения (Шибуц):</strong> Использование цитат, аллюзий и формул из Танаха. Придаёт тексту авторитет, глубину и связь с традицией.
            </li>
          </ul>
        </article>
  
        {/* Exam Relevance */}
        <section id="exam-relevance" className="border-2 border-ink rounded-lg p-6 my-8 bg-white/50" style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}>
          <h2 className="text-xl font-bold mb-3 border-b border-ink pb-2 text-ink">7. Значение для экзамена</h2>
          <p className="leading-relaxed mb-0 text-ink">
            На экзамене важно демонстрировать анализ на двух уровнях:
            <br/><strong>1. Смысловой:</strong> О чём текст, конфликт, идея.
            <br/><strong>2. Формальный:</strong> Как организована речь (рифмы, акростих, библейские аллюзии).
            <br/>Соединение содержания и формы показывает понимание традиции как системы.
          </p>
        </section>
      </section>
    )
  }