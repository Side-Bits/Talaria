import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';

export interface CalendarDatePickerModalProps {
  visible: boolean;
  value: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minDate?: Date;
  maxDate?: Date;
  title?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  weekDayLabels?: string[];
  showTodayShortcut?: boolean;
}

const DEFAULT_WEEK_DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getMonthStart = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

const startOfDay = (date: Date): Date => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const getDaysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function CalendarDatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
  minDate,
  maxDate,
  title,
  cancelLabel = 'Cancel',
  confirmLabel = 'Apply',
  weekDayLabels = DEFAULT_WEEK_DAY_LABELS,
  showTodayShortcut = true,
}: CalendarDatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(value);
  const [displayMonth, setDisplayMonth] = useState<Date>(getMonthStart(value));
  const [mounted, setMounted] = useState(visible);
  const sheetTranslateY = useRef(new Animated.Value(360)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const today = startOfDay(new Date());
  const normalizedMinDate = minDate ? startOfDay(minDate) : undefined;
  const normalizedMaxDate = maxDate ? startOfDay(maxDate) : undefined;

  const clampToRange = (date: Date) => {
    const normalized = startOfDay(date);
    if (normalizedMinDate && normalized < normalizedMinDate) return normalizedMinDate;
    if (normalizedMaxDate && normalized > normalizedMaxDate) return normalizedMaxDate;
    return normalized;
  };

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setSelectedDate(value);
      setDisplayMonth(getMonthStart(value));
    }
  }, [visible, value]);

  useEffect(() => {
    if (visible) {
      sheetTranslateY.setValue(360);
      backdropOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) return;
    Animated.parallel([
      Animated.timing(sheetTranslateY, {
        toValue: 360,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [visible, mounted, sheetTranslateY, backdropOpacity]);

  useEffect(() => {
    if (!visible || !selectedDate) return;

    const selected = startOfDay(selectedDate);
    if (normalizedMinDate && selected < normalizedMinDate) {
      setSelectedDate(normalizedMinDate);
      return;
    }
    if (normalizedMaxDate && selected > normalizedMaxDate) {
      setSelectedDate(normalizedMaxDate);
    }
  }, [normalizedMinDate, normalizedMaxDate, selectedDate, visible]);

  const canGoToPreviousMonth = !normalizedMinDate || getMonthStart(displayMonth) > getMonthStart(normalizedMinDate);
  const canGoToNextMonth = !normalizedMaxDate || getMonthStart(displayMonth) < getMonthStart(normalizedMaxDate);
  const monthLabel = displayMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(displayMonth.getFullYear(), displayMonth.getMonth());
    const monthOffset = (new Date(displayMonth.getFullYear(), displayMonth.getMonth(), 1).getDay() + 6) % 7;
    const totalCells = 42;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNumber = i - monthOffset + 1;
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return null;
      }

      const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), dayNumber);
      const normalized = startOfDay(date);
      const disabled =
        (normalizedMinDate && normalized < normalizedMinDate) || (normalizedMaxDate && normalized > normalizedMaxDate);

      return {
        key: `${displayMonth.getFullYear()}-${displayMonth.getMonth()}-${dayNumber}`,
        date,
        dayNumber,
        disabled: Boolean(disabled),
        isToday: isSameDay(normalized, today),
        isSelected: selectedDate ? isSameDay(normalized, startOfDay(selectedDate)) : false,
      };
    });
  }, [displayMonth, normalizedMaxDate, normalizedMinDate, selectedDate, today]);

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        <Pressable style={styles.backdropPressable} onPress={onCancel} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslateY }] }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Pressable onPress={onCancel} style={styles.headerBtn}>
              <ThemedText style={styles.cancelText}>{cancelLabel}</ThemedText>
            </Pressable>
            {title && <ThemedText style={styles.titleText}>{title}</ThemedText>}
            <Pressable onPress={() => onConfirm(selectedDate)} style={styles.headerBtn}>
              <ThemedText style={styles.confirmText}>{confirmLabel}</ThemedText>
            </Pressable>
          </View>

          <View style={styles.body}>
            <View style={styles.monthSwitcher}>
              <Pressable
                onPress={() => canGoToPreviousMonth && setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1))}
                style={[styles.navBtn, !canGoToPreviousMonth && styles.navBtnDisabled]}
                disabled={!canGoToPreviousMonth}
              >
                <ThemedText style={[styles.navText, !canGoToPreviousMonth && styles.navTextDisabled]}>‹</ThemedText>
              </Pressable>
              <ThemedText style={styles.monthLabel}>{monthLabel}</ThemedText>
              <Pressable
                onPress={() => canGoToNextMonth && setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1))}
                style={[styles.navBtn, !canGoToNextMonth && styles.navBtnDisabled]}
                disabled={!canGoToNextMonth}
              >
                <ThemedText style={[styles.navText, !canGoToNextMonth && styles.navTextDisabled]}>›</ThemedText>
              </Pressable>
            </View>

            <View style={styles.weekHeader}>
              {weekDayLabels.slice(0, 7).map(label => (
                <ThemedText key={label} style={styles.weekLabel}>
                  {label}
                </ThemedText>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {days.map((day, idx) => {
                if (!day) {
                  return <View key={`empty-${idx}`} style={styles.emptyCell} />;
                }

                return (
                  <Pressable
                    key={day.key}
                    disabled={day.disabled}
                    onPress={() => setSelectedDate(day.date)}
                    style={[
                      styles.dayCell,
                      day.isToday && styles.dayCellToday,
                      day.isSelected && styles.dayCellSelected,
                      day.disabled && styles.dayCellDisabled,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.dayText,
                        day.isSelected && styles.dayTextSelected,
                        day.disabled && styles.dayTextDisabled,
                      ]}
                    >
                      {day.dayNumber}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {showTodayShortcut && (
            <View style={styles.footer}>
              <Pressable
                onPress={() => {
                  const nextDate = clampToRange(new Date());
                  setSelectedDate(nextDate);
                  setDisplayMonth(getMonthStart(nextDate));
                }}
                style={styles.todayBtn}
                accessibilityRole="button"
                accessibilityLabel="Jump to today"
              >
                <Ionicons name="today-outline" size={16} color={Colors.light.tint} />
              </Pressable>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DADADA',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerBtn: {
    minWidth: 60,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  cancelText: {
    fontSize: 15,
    color: Colors.light.gray,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.tint,
    textAlign: 'right',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  monthSwitcher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    textTransform: 'capitalize',
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
  },
  navBtnDisabled: {
    backgroundColor: '#F9F9F9',
  },
  navText: {
    fontSize: 22,
    color: Colors.light.text,
    marginTop: -2,
  },
  navTextDisabled: {
    color: '#B9B9B9',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.gray,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  emptyCell: {
    width: '14.285%', // 100% / 7 days
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.285%', // 100% / 7 days
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  dayCellSelected: {
    backgroundColor: Colors.light.tint,
  },
  dayCellDisabled: {
    opacity: 0.35,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  dayTextSelected: {
    color: '#FFF',
  },
  dayTextDisabled: {
    color: '#9E9E9E',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'flex-start',
  },
  todayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3ED',
    borderWidth: 1,
    borderColor: '#FFD9CB',
  },
});
