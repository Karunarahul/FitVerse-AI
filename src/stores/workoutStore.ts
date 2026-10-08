import { create } from 'zustand';
import { WorkoutPlan, LiveWorkoutState } from '../types';
import { demoWorkout } from '../utils/demoData';
import { storage } from '../services/storage';

interface WorkoutState {
  currentPlan: WorkoutPlan;
  activeSession: LiveWorkoutState | null;
  setPlan: (plan: WorkoutPlan) => void;
  loadPersistedPlan: () => Promise<void>;
  
  // Live workout actions
  startLiveWorkout: (planId?: string) => void;
  tickTimer: () => void;
  togglePause: () => void;
  completeSet: () => { exerciseCompleted: boolean; workoutFinished: boolean };
  skipExercise: () => void;
  finishWorkout: () => { caloriesBurned: number; elapsedSeconds: number };
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentPlan: demoWorkout,
  activeSession: null,

  setPlan: (plan: WorkoutPlan) => {
    set({ currentPlan: plan });
    storage.setItem(storage.KEYS.WORKOUT_PLAN, plan);
  },

  loadPersistedPlan: async () => {
    const saved = await storage.getItem<WorkoutPlan>(storage.KEYS.WORKOUT_PLAN);
    if (saved) {
      set({ currentPlan: saved });
    }
  },

  startLiveWorkout: (planId?: string) => {
    const plan = get().currentPlan;
    // reset exercise completedSets for a fresh session
    const resetExercises = plan.exercises.map((e) => ({ ...e, completedSets: 0 }));
    set({
      currentPlan: { ...plan, exercises: resetExercises },
      activeSession: {
        planId: planId || plan.id,
        exerciseIndex: 0,
        currentSet: 1,
        elapsedSeconds: 0,
        isPaused: false,
        heartRate: 138,
        caloriesBurned: 18,
        completedExercises: [],
      },
    });
  },

  tickTimer: () => {
    const session = get().activeSession;
    if (!session || session.isPaused) return;

    const newElapsed = session.elapsedSeconds + 1;
    // approximate calorie burn ~ 8-10 kcal per minute
    const newBurned = Math.round(18 + (newElapsed / 60) * 8.5);
    // dynamic heart rate fluctuation around 140
    const hrVariance = (newElapsed % 6) - 3;
    const newHr = 142 + hrVariance;

    set({
      activeSession: {
        ...session,
        elapsedSeconds: newElapsed,
        caloriesBurned: newBurned,
        heartRate: newHr,
      },
    });
  },

  togglePause: () => {
    const session = get().activeSession;
    if (!session) return;
    set({
      activeSession: {
        ...session,
        isPaused: !session.isPaused,
      },
    });
  },

  completeSet: () => {
    const { activeSession, currentPlan } = get();
    if (!activeSession) return { exerciseCompleted: false, workoutFinished: false };

    const currentEx = currentPlan.exercises[activeSession.exerciseIndex];
    if (!currentEx) return { exerciseCompleted: false, workoutFinished: false };

    const nextSet = activeSession.currentSet + 1;

    // Update exercise completedSets
    const updatedExercises = [...currentPlan.exercises];
    updatedExercises[activeSession.exerciseIndex] = {
      ...currentEx,
      completedSets: Math.min(currentEx.sets, currentEx.completedSets + 1),
    };

    if (nextSet > currentEx.sets) {
      const nextIndex = activeSession.exerciseIndex + 1;
      if (nextIndex >= currentPlan.exercises.length) {
        set({
          currentPlan: { ...currentPlan, exercises: updatedExercises },
          activeSession: {
            ...activeSession,
            completedExercises: [...activeSession.completedExercises, currentEx.id],
          },
        });
        return { exerciseCompleted: true, workoutFinished: true };
      } else {
        set({
          currentPlan: { ...currentPlan, exercises: updatedExercises },
          activeSession: {
            ...activeSession,
            exerciseIndex: nextIndex,
            currentSet: 1,
            completedExercises: [...activeSession.completedExercises, currentEx.id],
          },
        });
        return { exerciseCompleted: true, workoutFinished: false };
      }
    } else {
      set({
        currentPlan: { ...currentPlan, exercises: updatedExercises },
        activeSession: {
          ...activeSession,
          currentSet: nextSet,
        },
      });
      return { exerciseCompleted: false, workoutFinished: false };
    }
  },

  skipExercise: () => {
    const { activeSession, currentPlan } = get();
    if (!activeSession) return;

    const nextIndex = activeSession.exerciseIndex + 1;
    if (nextIndex >= currentPlan.exercises.length) {
      // End workout
      set({ activeSession: null });
    } else {
      set({
        activeSession: {
          ...activeSession,
          exerciseIndex: nextIndex,
          currentSet: 1,
        },
      });
    }
  },

  finishWorkout: () => {
    const { activeSession } = get();
    const caloriesBurned = activeSession?.caloriesBurned || 420;
    const elapsedSeconds = activeSession?.elapsedSeconds || 1800;
    set({ activeSession: null });
    return { caloriesBurned, elapsedSeconds };
  },
}));
