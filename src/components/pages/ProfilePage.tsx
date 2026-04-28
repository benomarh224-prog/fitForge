'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import {
  User, Target, Flame, TrendingDown, Calendar,
  Dumbbell, Trophy, Edit3, Save, X, Check,
  Weight, Ruler, Activity, Apple, Camera, ChevronUp,
  Mail, Phone, MapPin, Calendar as CalendarIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Avatar Options ────────────────────────────────────────────────────
const avatarOptions = [
  { id: 'emerald', emoji: '💪', gradient: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500/40' },
  { id: 'violet', emoji: '🏋️', gradient: 'from-violet-500 to-purple-600', ring: 'ring-violet-500/40' },
  { id: 'amber', emoji: '🔥', gradient: 'from-amber-500 to-orange-600', ring: 'ring-amber-500/40' },
  { id: 'rose', emoji: '🎯', gradient: 'from-rose-500 to-pink-600', ring: 'ring-rose-500/40' },
  { id: 'sky', emoji: '⚡', gradient: 'from-sky-500 to-blue-600', ring: 'ring-sky-500/40' },
  { id: 'lime', emoji: '🥇', gradient: 'from-lime-500 to-green-600', ring: 'ring-lime-500/40' },
  { id: 'fuchsia', emoji: '⭐', gradient: 'from-fuchsia-500 to-pink-600', ring: 'ring-fuchsia-500/40' },
  { id: 'teal', emoji: '🧬', gradient: 'from-teal-500 to-cyan-600', ring: 'ring-teal-500/40' },
];

const goalLabels: Record<string, string> = {
  lose_weight: 'Lose Weight',
  gain_muscle: 'Build Muscle',
  stay_fit: 'Stay Fit',
  improve_endurance: 'Endurance',
};

const levelLabels: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

function getInitials(name: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getAvatarOption(id: string) {
  return avatarOptions.find((a) => a.id === id) || avatarOptions[0];
}

export function ProfilePage() {
  const store = useAppStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatarPickerRef = useRef<HTMLDivElement>(null);

  // Extended profile data
  const [editData, setEditData] = useState({
    name: store.name || '',
    email: '', // New field
    phone: '', // New field
    bio: '', // New field
    location: '', // New field
    dateOfBirth: '', // New field
    weight: store.weight,
    height: store.height,
    goal: store.goal,
    level: store.level,
    weeklyGoal: store.weeklyGoal,
    avatar: store.avatar || 'emerald',
  });

  // Close avatar picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarPickerRef.current && !avatarPickerRef.current.contains(e.target as Node)) {
        setShowAvatarPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const startEditing = () => {
    setEditData({
      name: store.name || '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      dateOfBirth: '',
      weight: store.weight,
      height: store.height,
      goal: store.goal,
      level: store.level,
      weeklyGoal: store.weeklyGoal,
      avatar: store.avatar || 'emerald',
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    store.setUserProfile({
      name: editData.name.trim() || undefined,
      weight: editData.weight,
      height: editData.height,
      goal: editData.goal,
      level: editData.level,
      weeklyGoal: editData.weeklyGoal,
      avatar: editData.avatar,
    });
    setIsEditing(false);
    setShowAvatarPicker(false);
    toast({
      title: 'Profile saved!',
      description: 'Your changes have been saved successfully.',
    });
  };

  const handleCancel = () => {
    setEditData({
      name: store.name || '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      dateOfBirth: '',
      weight: store.weight,
      height: store.height,
      goal: store.goal,
      level: store.level,
      weeklyGoal: store.weeklyGoal,
      avatar: store.avatar || 'emerald',
    });
    setIsEditing(false);
    setShowAvatarPicker(false);
  };

  const displayName = store.name || 'Set Your Name';
  const avatar = getAvatarOption(store.avatar || 'emerald');
  const bmi = store.height > 0 ? (store.weight / (store.height / 100) ** 2).toFixed(1) : '—';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your <span className="gradient-text">Profile</span>
            </h1>
            <p className="text-muted-foreground mt-1">Manage your personal information and fitness goals</p>
          </div>
          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div key="edit-btn" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Button onClick={startEditing} className="rounded-xl gap-2">
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
              </motion.div>
            ) : (
              <motion.div key="save-btns" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-2">
                <Button variant="ghost" onClick={handleCancel} className="rounded-xl gap-2">
                  <X className="h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSave} className="rounded-xl gap-2">
                  <Check className="h-4 w-4" /> Save
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                    {isEditing && (
                      <Badge variant="outline" className="ml-auto text-xs text-primary border-primary/30">Editing</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="edit-mode"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Avatar Picker */}
                        <div className="space-y-2" ref={avatarPickerRef}>
                          <Label className="text-sm">Profile Picture</Label>
                          <div className="relative">
                            <button
                              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                              className="group flex items-center gap-4 w-full p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
                            >
                              <div className={cn(
                                'h-16 w-16 rounded-full bg-gradient-to-br flex items-center justify-center text-2xl ring-2 ring-offset-2 ring-offset-background transition-all',
                                `bg-gradient-to-br ${getAvatarOption(editData.avatar).gradient}`,
                                getAvatarOption(editData.avatar).ring,
                              )}>
                                {editData.name ? getInitials(editData.name) : getAvatarOption(editData.avatar).emoji}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-lg font-medium">
                                  {editData.name || 'Your Name'}
                                </p>
                                <p className="text-sm text-muted-foreground">Click to change avatar</p>
                              </div>
                              <Camera className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </button>

                            {/* Picker Dropdown */}
                            <AnimatePresence>
                              {showAvatarPicker && (
                                <motion.div
                                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute z-50 top-full mt-2 left-0 right-0 bg-popover border border-border rounded-xl shadow-xl p-4"
                                >
                                  <div className="grid grid-cols-4 gap-3">
                                    {avatarOptions.map((opt) => (
                                      <button
                                        key={opt.id}
                                        onClick={() => {
                                          setEditData({ ...editData, avatar: opt.id });
                                          setShowAvatarPicker(false);
                                        }}
                                        className={cn(
                                          'h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center text-lg transition-all mx-auto',
                                          opt.gradient,
                                          editData.avatar === opt.id
                                            ? `ring-2 ring-offset-2 ring-offset-popover ${opt.ring} scale-110`
                                            : 'opacity-70 hover:opacity-100 hover:scale-105'
                                        )}
                                      >
                                        {opt.emoji}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <Separator />

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Full Name</Label>
                            <Input
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              placeholder="Enter your full name..."
                              className="h-10"
                              maxLength={100}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Email</Label>
                            <Input
                              type="email"
                              value={editData.email}
                              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                              placeholder="your.email@example.com"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Phone</Label>
                            <Input
                              type="tel"
                              value={editData.phone}
                              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                              placeholder="+1 (555) 123-4567"
                              className="h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Location</Label>
                            <Input
                              value={editData.location}
                              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                              placeholder="City, Country"
                              className="h-10"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Bio</Label>
                          <Textarea
                            value={editData.bio}
                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                            placeholder="Tell us about yourself, your fitness journey, goals..."
                            className="min-h-20 resize-none"
                            maxLength={500}
                          />
                          <p className="text-xs text-muted-foreground">
                            {editData.bio.length}/500 characters
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="view-mode"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Avatar + Name */}
                        <div className="flex items-center gap-6">
                          <div className={cn(
                            'h-20 w-20 rounded-full bg-gradient-to-br flex items-center justify-center text-3xl ring-4 ring-offset-4 ring-offset-background',
                            `bg-gradient-to-br ${avatar.gradient}`,
                            avatar.ring,
                          )}>
                            {store.name ? getInitials(store.name) : avatar.emoji}
                          </div>
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold">{displayName}</h2>
                            <Badge variant="secondary" className="mt-2">{levelLabels[store.level] || store.level}</Badge>
                            <p className="text-muted-foreground mt-2">
                              {goalLabels[store.goal] || store.goal} • {store.weeklyGoal} workouts/week
                            </p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Not provided</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Not provided</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Not provided</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Not provided</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Fitness Goals & Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Fitness Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div
                        key="edit-goals"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Body Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Weight (kg)</Label>
                            <Input
                              type="number"
                              value={editData.weight}
                              onChange={(e) => setEditData({ ...editData, weight: Number(e.target.value) })}
                              className="h-10"
                              min={30}
                              max={300}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Height (cm)</Label>
                            <Input
                              type="number"
                              value={editData.height}
                              onChange={(e) => setEditData({ ...editData, height: Number(e.target.value) })}
                              className="h-10"
                              min={100}
                              max={250}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Weekly Goal</Label>
                            <Input
                              type="number"
                              min={1}
                              max={7}
                              value={editData.weeklyGoal}
                              onChange={(e) => setEditData({ ...editData, weeklyGoal: Number(e.target.value) })}
                              className="h-10"
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Goal & Level */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">Fitness Goal</Label>
                            <Select value={editData.goal} onValueChange={(v) => setEditData({ ...editData, goal: v })}>
                              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lose_weight">Lose Weight</SelectItem>
                                <SelectItem value="gain_muscle">Build Muscle</SelectItem>
                                <SelectItem value="stay_fit">Stay Fit</SelectItem>
                                <SelectItem value="improve_endurance">Improve Endurance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Fitness Level</Label>
                            <Select value={editData.level} onValueChange={(v) => setEditData({ ...editData, level: v })}>
                              <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="view-goals"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <Weight className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-xl font-semibold">{store.weight}kg</p>
                            <p className="text-sm text-muted-foreground">Weight</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <Ruler className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-xl font-semibold">{store.height}cm</p>
                            <p className="text-sm text-muted-foreground">Height</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <Activity className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-xl font-semibold">{bmi}</p>
                            <p className="text-sm text-muted-foreground">BMI</p>
                          </div>
                          <div className="p-4 rounded-xl bg-muted/50 text-center">
                            <Target className="h-5 w-5 mx-auto mb-2 text-primary" />
                            <p className="text-xl font-semibold">{store.weeklyGoal}</p>
                            <p className="text-sm text-muted-foreground">Weekly Goal</p>
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold mb-2">Current Goal</h3>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                              {goalLabels[store.goal] || store.goal}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Fitness Level</h3>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                              {levelLabels[store.level] || store.level}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Flame className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Consistency King</p>
                        <p className="text-xs text-muted-foreground">7 day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Workout Warrior</p>
                        <p className="text-xs text-muted-foreground">50+ workouts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Goal Crusher</p>
                        <p className="text-xs text-muted-foreground">Complete weekly goal</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    This Week
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Workouts completed</span>
                      <span className="font-semibold">4/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Calories burned</span>
                      <span className="font-semibold">2,450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active minutes</span>
                      <span className="font-semibold">320</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}