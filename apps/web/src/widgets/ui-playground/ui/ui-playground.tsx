import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBoardToolShortcuts } from '@/features/board-controls'
import {
  BoardToolbar,
  BoardZoomControl,
  Button,
  Checkbox,
  Input,
  StickyColorPicker,
  Switch,
  Tabs,
  type BoardTool,
  type StickyColor,
} from '@/shared/components/ui'

type PreviewTab = 'board' | 'components'

export function UiPlayground() {
  const { t } = useTranslation('ui')
  const [tab, setTab] = useState<PreviewTab>('board')
  const [activeTool, setActiveTool] = useState<BoardTool>('select')
  const [color, setColor] = useState<StickyColor>('yellow')
  const [zoomPercent, setZoomPercent] = useState(100)
  const [checked, setChecked] = useState(false)
  const [switched, setSwitched] = useState(false)

  useBoardToolShortcuts({
    activeTool,
    onToolChange: setActiveTool,
    enabled: tab === 'board',
  })

  const boardPreview = (
    <section className="mt-6 gap-4 flex flex-col">
      <p className="text-muted-foreground text-sm">{t('showcase.boardHint')}</p>
      <div className="border-border bg-canvas min-w-0 gap-6 rounded-lg p-4 flex min-h-[440px] flex-col justify-between border">
        <div className="flex justify-center overflow-x-auto">
          <BoardToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>
        <div className="gap-4 flex flex-wrap items-end justify-between">
          <StickyColorPicker selectedColor={color} onColorChange={setColor} />
          <BoardZoomControl
            zoomPercent={zoomPercent}
            onZoomIn={() => setZoomPercent((value) => Math.min(value + 25, 200))}
            onZoomOut={() => setZoomPercent((value) => Math.max(value - 25, 25))}
            onFitAll={() => setZoomPercent(100)}
            canZoomIn={zoomPercent < 200}
            canZoomOut={zoomPercent > 25}
          />
        </div>
      </div>
    </section>
  )

  const componentsPreview = (
    <section className="mt-6 gap-6 flex flex-col">
      <div className="gap-3 flex flex-wrap">
        <Button>{t('stories.button.createBoard')}</Button>
        <Button variant="secondary">{t('stories.button.add')}</Button>
        <Button variant="outline">{t('stories.button.cancel')}</Button>
        <Button variant="destructive">{t('stories.button.delete')}</Button>
      </div>
      <label className="max-w-sm gap-2 text-sm flex flex-col">
        {t('stories.field.boardDescription')}
        <Input placeholder={t('stories.field.boardDescription')} />
      </label>
      <div className="gap-6 flex flex-wrap items-center">
        <label className="gap-2 text-sm flex items-center">
          <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
          {t('stories.field.selectAll')}
        </label>
        <label className="gap-2 text-sm flex items-center">
          <Switch checked={switched} onCheckedChange={setSwitched} />
          {t('stories.overlays.showGrid')}
        </label>
      </div>
    </section>
  )

  return (
    <div className="max-w-6xl gap-4 p-4 md:p-6 mx-auto flex w-full flex-col">
      <h1 className="text-foreground text-2xl font-semibold">{t('showcase.title')}</h1>
      <Tabs
        value={tab}
        onValueChange={setTab}
        label={t('showcase.tabsLabel')}
        options={[
          { value: 'board', label: t('showcase.boardTab'), content: boardPreview },
          { value: 'components', label: t('showcase.componentsTab'), content: componentsPreview },
        ]}
      />
    </div>
  )
}
