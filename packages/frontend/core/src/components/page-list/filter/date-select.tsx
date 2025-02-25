import { DatePicker, Popover, type PopoverProps } from '@affine/component';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';

import { datePickerTriggerInput } from './date-select.css';

const datePickerPopperContentOptions: PopoverProps['contentOptions'] = {
  style: { padding: 20, marginTop: 10 },
};

export const DateSelect = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const t = useAFFiNEI18N();
  const [open, setOpen] = useState(false);

  const onDateChange = useCallback(
    (e: string) => {
      setOpen(false);
      onChange(dayjs(e, 'YYYY-MM-DD').valueOf());
    },
    [onChange]
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      contentOptions={datePickerPopperContentOptions}
      content={
        <DatePicker
          weekDays={t['com.affine.calendar-date-picker.week-days']()}
          monthNames={t['com.affine.calendar-date-picker.month-names']()}
          todayLabel={t['com.affine.calendar-date-picker.today']()}
          value={dayjs(value as number).format('YYYY-MM-DD')}
          onChange={onDateChange}
        />
      }
    >
      <input
        value={dayjs(value as number).format('MMM DD')}
        className={datePickerTriggerInput}
      />
    </Popover>
  );
};
