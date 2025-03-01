import styles from './SignUpForm.module.css';
import { useForm } from 'react-hook-form';
import { SignUpType } from '../../../shared/types/SignUpType.ts';
import { Delay } from '../../../shared/lib/Delay.ts';
import { useNavigate } from 'react-router';
import { useSession } from '../../../shared/lib/useSession.ts';
import openEye from '../../../shared/assets/icons/openEye.svg';
import closeEye from '../../../shared/assets/icons/closeEye.svg';
import { useState } from 'react';

export function SignUpForm() {
  const navigate = useNavigate();
  const [firstConfirmPasswordState, setFirstConfirmPasswordState] =
    useState(false);
  const [secondConfirmPasswordState, setSecondConfirmPasswordState] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpType>({ mode: 'onChange' });

  const sendSignUpInputValue = async (data: SignUpType) => {
    const { passwordCheck, ...filterData } = data;
    useSession('step1Data', filterData);

    if (filterData) {
      await Delay(2000);
      navigate('/signUp/step2');
    }
  };

  const confirmPasswordValue = () => {
    setFirstConfirmPasswordState((prev) => !prev);
  };

  const confirmPassword = () => {
    setSecondConfirmPasswordState((prev) => !prev);
  };

  return (
    <form
      className={styles.formContainer}
      onSubmit={handleSubmit(sendSignUpInputValue)}
    >
      <div className={styles.inputContainer}>
        <label className={styles.subTitle}>이메일</label>
        <input
          type='text'
          className={styles.inputText}
          placeholder='example@email.com'
          aria-invalid={
            errors.email
              ? 'true'
              : isValid && !errors.email
                ? 'false'
                : undefined
          }
          {...register('email', {
            required: '이메일 값 입력은 필수입니다.',
            pattern: {
              value: /^[a-zA-Z]{3,}\w{0,7}@[a-zA-Z]{3,}\.[a-zA-Z]{2,}$/,
              message: '이메일 형식에 맞게 입력해주세요.',
            },
          })}
        />
      </div>
      {errors.email && (
        <span className={styles.errorFont}>{errors.email.message}</span>
      )}
      <div className={styles.passwordInputContainer}>
        <label className={styles.subTitle}>비밀번호</label>
        <input
          type={secondConfirmPasswordState ? 'text' : 'password'}
          className={styles.inputText}
          placeholder='비밀번호'
          aria-invalid={
            errors.password
              ? 'true'
              : isValid && !errors.password
                ? 'false'
                : undefined
          }
          {...register('password', {
            required: '비밀번호는 필수 입력값입니다.',
            minLength: {
              value: 8,
              message: '비밀번호 길이를 8자리 이상 입력해주세요.',
            },
          })}
        />
        <img
          src={secondConfirmPasswordState ? openEye : closeEye}
          alt='비밀번호 확인'
          onClick={confirmPassword}
          className={styles.topIcon}
        />
        {!errors.password && (
          <span className={styles.defaultFont}>
            영문 대·소문자/숫자/특수문자 중 2가지 이상 조합, 8자~32자만
            가능합니다..
          </span>
        )}
      </div>
      {errors.password && (
        <span className={styles.passwordError}>{errors.password.message}</span>
      )}
      <input
        type={firstConfirmPasswordState ? 'text' : 'password'}
        className={styles.passwordInputText}
        placeholder='비밀번호 확인'
        aria-invalid={
          errors.passwordCheck
            ? 'true'
            : isValid && !errors.passwordCheck
              ? 'false'
              : undefined
        }
        {...register('passwordCheck', {
          required: '비밀번호는 필수 입력값입니다.',
          minLength: {
            value: 8,
            message: '비밀번호 길이를 8자리 이상 입력해주세요.',
          },
          validate: (value) =>
            value === watch('password') || '비밀번호가 일치 하지 않습니다.',
        })}
      />
      <img
        src={firstConfirmPasswordState ? openEye : closeEye}
        alt='비밀번호 확인'
        onClick={confirmPasswordValue}
        className={styles.bottomIcon}
      />
      {errors.passwordCheck && (
        <span className={styles.passwordCheckError}>
          {errors.passwordCheck.message}
        </span>
      )}
      <button
        className={styles.buttonContainer}
        disabled={!isValid || isSubmitting}
      >
        다음
      </button>
    </form>
  );
}
