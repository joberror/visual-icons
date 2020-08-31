var api = {

  getFiles: function (fo, aExtensions, bRecursive, aFiles, includeFolder)

  {

    var exts = aExtensions ? aExtensions.join("|") : ".+";

    var pattern = new RegExp("\\.(" + exts + ")$");

    !aFiles && aFiles = [];

    var filterFunction = function (file)

    {

      return pattern.test(file.name);

    }

    if (bRecursive && fo.name.indexOf(".") != 0)

    {

      var foFiles = fo.getFiles();

      while (f = foFiles.shift())

      {

        if (f instanceof Folder)

        {

          if (includeFolder === true) files[files.length] = f;

          this.getFiles(f, aExtensions, true, aFiles);

        }

        if (f instanceof File && pattern.test(f.name) && f.name != ".DS_Store") {

          aFiles[aFiles.length] = f;

        }

      }

      return aFiles;

    } else

    {

      return fo.getFiles(filterFunction);

    }

  },

}

//Main routine

var main = function () {

  var fo = Folder.selectDialog("Please select a folder"),

    files, n = 0,
    doc, nFile,

    opts = new EPSSaveOptions();

  //Settings options

  // opts.… = …

  //Exit if no selected folder

  if (!fo) return;

  //getting AI files

  files = api.getFiles(fo, ["ai"], true);

  n = files.length;

  //Exit if no files found

  if (!n) {

    alert("No files found sorry");

    return;

  }

  //convert found files

  while (n--) {

    nFile = files;

    doc = app.open(files);

    doc.saveAs(File(nFile.parent + "/" + nFile.name.replace(/\.ai$/, '.eps')), opts);

    doc.close();

  }

}

//run

main();