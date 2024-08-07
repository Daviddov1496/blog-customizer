import { useState, FormEvent, useEffect, useRef } from 'react';

import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';

import {
	OptionType,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from '../../constants/articleProps';

import { ArrowButton } from '../arrow-button';
import { Text } from '../text';
import { Select } from '../select';
import { RadioGroup } from '../radio-group';
import { Separator } from '../separator';
import { Button } from '../button';

type TArticleParamsFormProps = {
	// создаю тип который описывает пропсы для компонента
	setSettings: (value: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ setSettings }: TArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false); //состояние для открытия меню

	const [userSettings, setUserSettings] =
		useState<ArticleStateType>(defaultArticleState); // настройки пользователя

	function handleFormSubmit(e: FormEvent) {
		// применение настроек
		e.preventDefault();
		setSettings(userSettings);
	}

	function saveForm(option: keyof ArticleStateType) {
		// форма для сохранения настроек
		return function (selected: OptionType): void {
			setUserSettings((prevSettings) => ({
				...prevSettings,
				[option]: selected,
			}));
		};
	}

	function resetForm(e: FormEvent) {
		// форма сброса
		e.preventDefault();
		setUserSettings(defaultArticleState);
		setSettings(defaultArticleState);
	}

	const refContainer = useRef<HTMLDivElement | null>(null); // нахожу общий контейнер

	function handleOverlayClick(e: MouseEvent) {
		// закрытие на оверлей
		if (
			isOpen &&
			refContainer.current &&
			!refContainer.current.contains(e.target as Node)
		) {
			setIsOpen(false);
		}
	}

	useEffect(() => {
		// вешаю слушатель событий
		if (isOpen) {
			window.addEventListener('mousedown', handleOverlayClick);
		}
		return () => {
			// убираю слушатель
			window.removeEventListener('mousedown', handleOverlayClick);
		};
	}, [isOpen]);

	return (
		<div ref={refContainer} className={styles.wrapperForm}>
			<ArrowButton
				isOpen={isOpen}
				handleClickArrow={() => {
					setIsOpen(!isOpen);
				}}
			/>
			<aside
				className={clsx(styles.container, isOpen && styles.container_open)}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={resetForm}>
					<Text
						size={31}
						weight={800}
						fontStyle={'normal'}
						uppercase={true}
						align={'left'}
						family='open-sans'>
						Задайте параметры
					</Text>
					<Select
						selected={userSettings.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={saveForm('fontFamilyOption')}
						title='Шрифт'
					/>
					<RadioGroup
						name='fontSize'
						options={fontSizeOptions}
						selected={userSettings.fontSizeOption}
						onChange={saveForm('fontSizeOption')}
						title='рАЗМЕР шрифта'
					/>
					<Select
						selected={userSettings.fontColor}
						options={fontColors}
						onChange={saveForm('fontColor')}
						title={'Цвет шрифта'}
					/>
					<Separator />
					<Select
						selected={userSettings.backgroundColor}
						options={backgroundColors}
						onChange={saveForm('backgroundColor')}
						title='Цвет фона'
					/>
					<Select
						selected={userSettings.contentWidth}
						options={contentWidthArr}
						onChange={saveForm('contentWidth')}
						title='Ширина контента'
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='reset' />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</div>
	);
};
