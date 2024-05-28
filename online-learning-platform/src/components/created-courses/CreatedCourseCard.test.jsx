import React from 'react';
import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import CreatedCourseCard from './CreatedCourseCard';
import userEvent from '@testing-library/user-event';
import { describe, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { testDescription, testId, testLongDescription, testTitle } from '../../../__mock__/mock-course';
import { act } from '@testing-library/react';

const render = (component) => 
  rtlRender(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );

describe('CreatedCourseCard' , () => {
    test('test Card and mount course data title', async () => {
        render(<CreatedCourseCard title={testTitle} desc={testDescription} id={testId}/>);

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
    })

    test('test Card and mount course data description', async () => {
      render(<CreatedCourseCard title={testTitle} desc={testDescription} id={testId}/>);

      expect(screen.getByText(testDescription)).toBeInTheDocument()
  })
})