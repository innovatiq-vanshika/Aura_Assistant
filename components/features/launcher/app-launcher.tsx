"use client";

import { useState, useEffect } from 'react';
import { ArrowUpRight, Plus, Trash2, Edit, MoreHorizontal, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShortcut, AppCategory } from '@/lib/types/launcher-types';
import { launcherService } from '@/lib/services/launcher-service';

export default function AppLauncher() {
  const [shortcuts, setShortcuts] = useState<AppShortcut[]>([]);
  const [categories, setCategories] = useState<AppCategory[]>([
    { id: 'all', name: 'All' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'social', name: 'Social' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'other', name: 'Other' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newShortcut, setNewShortcut] = useState<AppShortcut>({
    id: '',
    name: '',
    url: '',
    icon: '🔗',
    category: 'other'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Load shortcuts
    const savedShortcuts = launcherService.getShortcuts();
    setShortcuts(savedShortcuts);
  }, []);

  const handleSaveShortcut = () => {
    if (!newShortcut.name || !newShortcut.url) return;

    // Make sure URL has a protocol
    let url = newShortcut.url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (isEditMode) {
      // Update existing shortcut
      const updatedShortcuts = shortcuts.map(s => 
        s.id === newShortcut.id ? { ...newShortcut, url } : s
      );
      setShortcuts(updatedShortcuts);
      launcherService.saveShortcuts(updatedShortcuts);
    } else {
      // Add new shortcut
      const shortcut: AppShortcut = {
        ...newShortcut,
        id: Date.now().toString(),
        url
      };
      const updatedShortcuts = [...shortcuts, shortcut];
      setShortcuts(updatedShortcuts);
      launcherService.saveShortcuts(updatedShortcuts);
    }

    // Reset form
    setNewShortcut({
      id: '',
      name: '',
      url: '',
      icon: '🔗',
      category: 'other'
    });
    setIsEditMode(false);
    setShowDialog(false);
  };

  const handleEditShortcut = (shortcut: AppShortcut) => {
    setNewShortcut(shortcut);
    setIsEditMode(true);
    setShowDialog(true);
  };

  const handleDeleteShortcut = (id: string) => {
    const updatedShortcuts = shortcuts.filter(s => s.id !== id);
    setShortcuts(updatedShortcuts);
    launcherService.saveShortcuts(updatedShortcuts);
  };

  const launchApp = (url: string) => {
    window.open(url, '_blank');
  };

  const filteredShortcuts = shortcuts.filter(shortcut => {
    const matchesCategory = selectedCategory === 'all' || shortcut.category === selectedCategory;
    const matchesSearch = shortcut.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shortcut.url.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getIconEmoji = () => {
    const icons = ['🔗', '🌐', '📝', '🎮', '📊', '📧', '🎬', '🎵', '📚', '💼', '🛒', '💬'];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>App Launcher</CardTitle>
              <CardDescription>Quick access to your favorite apps and websites</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setIsEditMode(false);
                    setNewShortcut({
                      id: '',
                      name: '',
                      url: '',
                      icon: getIconEmoji(),
                      category: 'other'
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add App
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit App Shortcut' : 'Add New App Shortcut'}</DialogTitle>
                    <DialogDescription>
                      {isEditMode 
                        ? 'Update your app details below' 
                        : 'Create a new shortcut to your favorite app or website'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Icon</label>
                      <Input
                        value={newShortcut.icon}
                        onChange={(e) => setNewShortcut({ ...newShortcut, icon: e.target.value })}
                        placeholder="Icon (emoji)"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Name</label>
                      <Input
                        value={newShortcut.name}
                        onChange={(e) => setNewShortcut({ ...newShortcut, name: e.target.value })}
                        placeholder="App name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">URL</label>
                      <Input
                        value={newShortcut.url}
                        onChange={(e) => setNewShortcut({ ...newShortcut, url: e.target.value })}
                        placeholder="https://example.com"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label className="text-right text-sm">Category</label>
                      <select
                        value={newShortcut.category}
                        onChange={(e) => setNewShortcut({ ...newShortcut, category: e.target.value })}
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        {categories.filter(c => c.id !== 'all').map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveShortcut}>
                      {isEditMode ? 'Update' : 'Add'} Shortcut
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mt-2">
            <TabsList className="w-full overflow-x-auto flex-wrap justify-start p-1 sm:justify-center">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {filteredShortcuts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredShortcuts.map(shortcut => (
                <Card
                  key={shortcut.id}
                  className="cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className="relative group">
                    <CardContent className="p-4 flex flex-col items-center text-center" onClick={() => launchApp(shortcut.url)}>
                      <div className="text-4xl my-2">{shortcut.icon}</div>
                      <h3 className="font-medium truncate w-full">{shortcut.name}</h3>
                      <p className="text-xs text-muted-foreground truncate w-full">
                        {shortcut.url}
                      </p>
                    </CardContent>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-sm"
                            onClick={() => handleEditShortcut(shortcut)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-sm text-destructive"
                            onClick={() => handleDeleteShortcut(shortcut.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity pb-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => launchApp(shortcut.url)}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No apps found</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                {searchTerm
                  ? `No apps match "${searchTerm}"`
                  : 'Add your first app shortcut to get started'}
              </p>
              <Button
                className="mt-4"
                onClick={() => {
                  setIsEditMode(false);
                  setNewShortcut({
                    id: '',
                    name: '',
                    url: '',
                    icon: getIconEmoji(),
                    category: 'other'
                  });
                  setShowDialog(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add App Shortcut
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}