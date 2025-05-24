import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { addMonths, eachDayOfInterval, endOfMonth, format, getYear, isSameDay, isSameMonth, startOfMonth } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

interface BottomSheetCalendarProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  version?: 'v1' | 'v2';
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ITEM_HEIGHT = 40;

const generateArrayInRange = (start: number, end: number) => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

export function BottomSheetCalendar({
  isVisible,
  onClose,
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  version = 'v1',
}: BottomSheetCalendarProps) {
  const theme = useColorScheme() ?? 'light';
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [scrollDate, setScrollDate] = useState({
    day: selectedDate.getDate(),
    month: selectedDate.getMonth() + 1,
    year: selectedDate.getFullYear(),
  });

  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  // Update scroll position when modal becomes visible
  useEffect(() => {
    if (isVisible && version === 'v2') {
      // Use setTimeout to ensure the ScrollViews are properly laid out
      setTimeout(() => {
        // Scroll to day
        const dayIndex = scrollDate.day - 1;
        dayScrollRef.current?.scrollTo({ y: dayIndex * ITEM_HEIGHT, animated: false });

        // Scroll to month
        const monthIndex = scrollDate.month - 1;
        monthScrollRef.current?.scrollTo({ y: monthIndex * ITEM_HEIGHT, animated: false });

        // Scroll to year
        // const currentYear = getYear(new Date());
        const yearIndex = years.findIndex(year => year === scrollDate.year);
        yearScrollRef.current?.scrollTo({ y: yearIndex * ITEM_HEIGHT, animated: false });
      }, 50);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, version, scrollDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'next' ? addMonths(currentMonth, 1) : addMonths(currentMonth, -1));
  };

  const renderCalendarDays = () => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });

    return (
      <View style={styles.daysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <ThemedText key={day} style={styles.weekdayLabel}>
            {day}
          </ThemedText>
        ))}
        {days.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
          const isCurrentMonth = isSameMonth(date, currentMonth);

          return (
            <TouchableOpacity
              key={date.toISOString()}
              onPress={() => !isDisabled && onDateSelect(date)}
              disabled={isDisabled}
              style={[
                styles.dayButton,
                isSelected && {
                  backgroundColor: Colors[theme].tint,
                },
              ]}>
              <ThemedText
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  !isCurrentMonth && styles.otherMonthText,
                  isDisabled && styles.disabledDayText,
                ]}>
                {format(date, 'd')}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const days = generateArrayInRange(1, 31);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentYear = getYear(new Date());
  const years = generateArrayInRange(currentYear - 50, currentYear + 50);

  const renderScrollablePicker = () => {
    const handleScroll = (value: number, type: 'day' | 'month' | 'year') => {
      setScrollDate(prev => ({ ...prev, [type]: value }));
      const newDate = new Date(
        type === 'year' ? value : scrollDate.year,
        type === 'month' ? value - 1 : scrollDate.month - 1,
        type === 'day' ? value : scrollDate.day
      );
      onDateSelect(newDate);
    };

    return (
      <View style={styles.scrollableContainer}>
        <View style={styles.scrollableColumn}>
          <View style={styles.labelContainer}>
            <IconSymbol
              name="calendar"
              size={16}
              color={Colors[theme].text}
              style={styles.labelIcon}
            />
            <ThemedText style={styles.scrollableLabel}>Day</ThemedText>
          </View>
          <ScrollView 
            ref={dayScrollRef}
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}>
            {days.map(day => (
              <TouchableOpacity
                key={`day-${day}`}
                style={[
                  styles.scrollableItem,
                  scrollDate.day === day && styles.selectedScrollItem,
                ]}
                onPress={() => handleScroll(day, 'day')}>
                <ThemedText style={[
                  styles.scrollableText,
                  scrollDate.day === day && styles.selectedScrollText,
                ]}>
                  {day}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.scrollableColumn}>
          <View style={styles.labelContainer}>
            <IconSymbol
              name="calendar"
              size={16}
              color={Colors[theme].text}
              style={styles.labelIcon}
            />
            <ThemedText style={styles.scrollableLabel}>Month</ThemedText>
          </View>
          <ScrollView 
            ref={monthScrollRef}
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}>
            {months.map((month, index) => (
              <TouchableOpacity
                key={`month-${month}`}
                style={[
                  styles.scrollableItem,
                  scrollDate.month === index + 1 && styles.selectedScrollItem,
                ]}
                onPress={() => handleScroll(index + 1, 'month')}>
                <ThemedText style={[
                  styles.scrollableText,
                  scrollDate.month === index + 1 && styles.selectedScrollText,
                ]}>
                  {month}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.scrollableColumn}>
          <View style={styles.labelContainer}>
            <IconSymbol
              name="calendar"
              size={16}
              color={Colors[theme].text}
              style={styles.labelIcon}
            />
            <ThemedText style={styles.scrollableLabel}>Year</ThemedText>
          </View>
          <ScrollView 
            ref={yearScrollRef}
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}>
            {years.map(year => (
              <TouchableOpacity
                key={`year-${year}`}
                style={[
                  styles.scrollableItem,
                  scrollDate.year === year && styles.selectedScrollItem,
                ]}
                onPress={() => handleScroll(year, 'year')}>
                <ThemedText style={[
                  styles.scrollableText,
                  scrollDate.year === year && styles.selectedScrollText,
                ]}>
                  {year}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <ThemedView style={styles.container}>
        {version === 'v1' ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigateMonth('prev')}>
                <IconSymbol
                  name="chevron.left"
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
              <ThemedText style={styles.monthText}>
                {format(currentMonth, 'MMMM yyyy')}
              </ThemedText>
              <TouchableOpacity onPress={() => navigateMonth('next')}>
                <IconSymbol
                  name="chevron.right"
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            </View>
            {renderCalendarDays()}
          </>
        ) : (
          renderScrollablePicker()
        )}
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: Colors[theme].tint }]}
          onPress={onClose}>
          <ThemedText style={styles.doneButtonText}>Done</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    height: SCREEN_HEIGHT * 0.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingTop: 16,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  dayButton: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  otherMonthText: {
    opacity: 0.3,
  },
  disabledDayText: {
    opacity: 0.2,
  },
  doneButton: {
    marginTop: 'auto',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    height: SCREEN_HEIGHT * 0.4,
  },
  scrollableColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 4,
    opacity: 0.6,
  },
  scrollableLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.6,
  },
  scrollView: {
    flex: 1,
  },
  scrollableItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedScrollItem: {
    backgroundColor: '#007AFF20',
  },
  scrollableText: {
    fontSize: 16,
  },
  selectedScrollText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
