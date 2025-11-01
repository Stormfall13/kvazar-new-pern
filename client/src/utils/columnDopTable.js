  // Определяем порядок и названия только нужных колонок
  const columns = [
    { key: 'id', label: 'ID', width: '100px' },
    { key: 'date', label: 'Дата', width: '140px' },
    { key: 'reglament', label: 'Регламент', width: '200px' },
    { key: 'inspector', label: 'Проверяющий', width: '150px' },
    { key: 'executor', label: 'Исполнитель', width: '150px' },
    { key: 'departament', label: 'Отдел', width: '120px' },
    { key: 'amount', label: 'Кол-во работ', width: '90px' },
    { key: 'typeWork', label: 'Вид работ', width: '100px' },
    { key: 'typeTest', label: 'Вид проверки', width: '100px' },
    { key: 'point', label: 'Баллы', width: '43px' },
    { key: 'recommen', label: 'Рекомендации', width: '91px' },
    { key: 'errors', label: 'Ошибки', width: '70px' },
    { key: 'critic', label: 'Критические', width: '90px' },
    { key: 'counting', label: 'Отчет', width: '165px' },
    { key: 'iteration', label: 'Итерации', width: '80px' },
    { key: 'pointsRemove', label: 'Снято баллов', width: '100px' },
    { key: 'dispute', label: 'Спор', width: '60px' },
    { key: 'commentError', label: 'Комментарий ошибки', width: '200px' },
    { key: 'delayTester', label: 'Просрочка тест.', width: '120px' },
    { key: 'delayExecutor', label: 'Просрочка исп.', width: '120px' },
    { key: 'linkReport', label: 'Ссылка на отчет', width: '200px' },
    { key: 'reportPeriods', label: 'Отчет времени', width: '120px' },
  ];

export default columns;